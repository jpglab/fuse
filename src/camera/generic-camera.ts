import { Logger, PTPTransferLog } from '@core/logger'
import { ObjectInfo } from '@ptp/datasets/object-info-dataset'
import { SessionAlreadyOpen } from '@ptp/definitions/response-definitions'
import { randomSessionId } from '@ptp/definitions/session'
import { createPTPRegistry, Registry } from '@ptp/registry'
import type { CodecDefinition, CodecInstance, CodecType } from '@ptp/types/codec'
import type { EventData } from '@ptp/types/event'
import { EventEmitter } from '@ptp/types/event'
import type { OperationDefinition } from '@ptp/types/operation'
import type { PropertyDefinition } from '@ptp/types/property'
import { EventNames, OperationParams, OperationResponse } from '@ptp/types/type-helpers'
import { DeviceDescriptor } from '@transport/interfaces/device.interface'
import { PTPEvent, TransportInterface } from '@transport/interfaces/transport.interface'

export class GenericCamera {
    protected emitter = new EventEmitter()
    public vendorId: number | null = null
    public sessionId = 0
    private transactionId = 0
    public transport: TransportInterface
    protected logger: Logger
    public registry: Registry

    constructor(transport: TransportInterface, logger: Logger) {
        this.transport = transport
        this.logger = logger
        this.registry = createPTPRegistry(transport.isLittleEndian())

        if (this.transport.on) {
            this.transport.on(this.handleEvent.bind(this))
        }
    }

    async connect(deviceIdentifier?: DeviceDescriptor): Promise<void> {
        if (!this.transport.isConnected()) {
            await this.transport.connect({ ...deviceIdentifier, ...(this.vendorId && { vendorId: this.vendorId }) })
        }

        this.sessionId = randomSessionId()
        const openResult = await this.send(this.registry.operations.OpenSession, { SessionID: this.sessionId })

        if (openResult.code === SessionAlreadyOpen.code) {
            await this.send(this.registry.operations.CloseSession, {})
            await this.send(this.registry.operations.OpenSession, { SessionID: this.sessionId })
        }
    }

    async disconnect(): Promise<void> {
        this.emitter.removeAllListeners()

        if (this.sessionId !== null) {
            await this.send(this.registry.operations.CloseSession, {})
        }

        this.sessionId = 0
        await this.transport.disconnect()
    }

    async send<Op extends OperationDefinition>(
        operation: Op,
        params: OperationParams<Op>,
        data?: Uint8Array,
        maxDataLength?: number
    ): Promise<OperationResponse<Op>> {
        const transactionId = this.getNextTransactionId()

        const encodedParams: Uint8Array[] = []
        const paramsRecord: Record<string, number | bigint | string> = params

        for (const paramDef of operation.operationParameters) {
            if (!paramDef) continue

            let value = paramsRecord[paramDef.name]

            if (value === undefined && 'defaultValue' in paramDef && paramDef.defaultValue !== undefined) {
                value = paramDef.defaultValue
            }

            if (value === undefined && !paramDef.required) continue

            if (value === undefined && paramDef.required) {
                throw new Error(`Required parameter ${paramDef.name} missing`)
            }

            const codec = this.resolveCodec(paramDef.codec)
            encodedParams.push(codec.encode(value))
        }

        const isPartialObjectOp = operation.name.includes('Partial')
        const objectHandleValue = isPartialObjectOp ? paramsRecord.ObjectHandle : null
        const objectHandle: number | null = typeof objectHandleValue === 'number' ? objectHandleValue : null

        let logId: number
        if (isPartialObjectOp && objectHandle !== null) {
            const existingLogId = this.logger.getActiveTransfer(objectHandle)
            if (existingLogId !== undefined) {
                logId = existingLogId
            } else {
                const transferLog: Omit<PTPTransferLog, 'id' | 'timestamp'> = {
                    type: 'ptp_transfer',
                    level: 'info',
                    sessionId: this.sessionId!,
                    transactionId,
                    objectHandle,
                    totalBytes: 0,
                    transferredBytes: 0,
                    chunks: [],
                    requestPhase: {
                        timestamp: Date.now(),
                        operationName: operation.name,
                        encodedParams,
                        decodedParams: paramsRecord,
                    },
                }
                logId = this.logger.addLog(transferLog)
                this.logger.registerTransfer(objectHandle, logId)
            }
        } else {
            logId = this.logger.addLog({
                type: 'ptp_operation',
                level: 'info',
                sessionId: this.sessionId!,
                transactionId,
                requestPhase: {
                    timestamp: Date.now(),
                    operationName: operation.name,
                    encodedParams,
                    decodedParams: paramsRecord,
                },
            })
        }

        const commandContainer = this.buildCommand(operation.code, transactionId, encodedParams)
        await this.transport.send(commandContainer, this.sessionId!, transactionId)

        let receivedData: Uint8Array | undefined
        if (operation.dataDirection === 'in') {
            if (!data) throw new Error('Data required for dataDirection=in')
            const dataContainer = this.buildData(operation.code, transactionId, data)

            this.logger.updateLog(logId, {
                dataPhase: {
                    timestamp: Date.now(),
                    direction: 'in',
                    bytes: data.length,
                    encodedData: data,
                    maxDataLength,
                },
            })

            await this.transport.send(dataContainer, this.sessionId!, transactionId)
        } else if (operation.dataDirection === 'out') {
            const bufferSize = maxDataLength || 256 * 1024
            const dataRaw = await this.transport.receive(bufferSize, this.sessionId!, transactionId)
            const dataContainer = this.parseContainer(dataRaw)
            receivedData = dataContainer.payload

            let decodedData: number | bigint | string | object | Uint8Array | undefined = undefined
            if (receivedData && receivedData.length > 0 && 'dataCodec' in operation && operation.dataCodec) {
                const codec = this.resolveCodec(operation.dataCodec)
                const result = codec.decode(receivedData)
                decodedData = result.value
            }

            if (
                receivedData &&
                receivedData.length > 0 &&
                !decodedData &&
                operation.name.includes('GetDevicePropValue')
            ) {
                const propCode = paramsRecord.DevicePropCode
                if (propCode !== undefined) {
                    const property = Object.values(this.registry.properties).find((p: any) => p.code === propCode)
                    if (property) {
                        const codec = this.resolveCodec(property.codec)
                        const result = codec.decode(receivedData)
                        decodedData = {
                            propertyName: property.name,
                            propertyCode: propCode,
                            value: result.value,
                        }
                    }
                }
            }

            if (isPartialObjectOp && typeof objectHandle === 'number') {
                const offsetValue =
                    typeof paramsRecord.Offset === 'number'
                        ? paramsRecord.Offset
                        : typeof paramsRecord.OffsetLower === 'number'
                          ? paramsRecord.OffsetLower
                          : 0
                const offsetUpperValue = typeof paramsRecord.OffsetUpper === 'number' ? paramsRecord.OffsetUpper : 0
                const fullOffset = offsetUpperValue * 0x100000000 + offsetValue
                const receivedBytes = receivedData?.length || 0

                const currentLog = this.logger.getLogById(logId)
                const isTransferLog = currentLog && currentLog.type === 'ptp_transfer'
                const chunks = isTransferLog ? [...currentLog.chunks] : []

                chunks.push({
                    transactionId,
                    timestamp: Date.now(),
                    offset: fullOffset,
                    bytes: receivedBytes,
                })

                const totalTransferred = chunks.reduce((sum, c) => sum + c.bytes, 0)
                const totalBytes =
                    isTransferLog && currentLog.totalBytes > 0
                        ? currentLog.totalBytes
                        : maxDataLength || fullOffset + receivedBytes

                this.logger.updateLog(logId, {
                    chunks,
                    totalBytes,
                    transferredBytes: totalTransferred,
                    dataPhase: {
                        timestamp: Date.now(),
                        direction: 'out',
                        bytes: receivedData?.length || 0,
                        encodedData: receivedData,
                        decodedData: decodedData,
                        maxDataLength,
                    },
                })
            } else {
                this.logger.updateLog(logId, {
                    dataPhase: {
                        timestamp: Date.now(),
                        direction: 'out',
                        bytes: receivedData?.length || 0,
                        encodedData: receivedData,
                        decodedData: decodedData,
                        maxDataLength,
                    },
                })
            }
        }

        const responseRaw = await this.transport.receive(512, this.sessionId!, transactionId)
        const responseContainer = this.parseContainer(responseRaw)

        this.logger.updateLog(logId, {
            responsePhase: {
                timestamp: Date.now(),
                code: responseContainer.code,
            },
        })

        const isPropertyOp = operation.name.includes('GetDevicePropValue')
        const finalData = this.logger.getLogs().find(l => l.id === logId)
        const returnData =
            !isPropertyOp &&
            finalData &&
            finalData.type === 'ptp_operation' &&
            finalData.dataPhase?.decodedData !== undefined
                ? finalData.dataPhase.decodedData
                : receivedData

        return {
            code: responseContainer.code,
            data: returnData,
        } as OperationResponse<Op>
    }

    async get<P extends PropertyDefinition>(property: P): Promise<CodecType<P['codec']>> {
        if (!property.access.includes('Get')) {
            throw new Error(`Property ${property.name} is not readable`)
        }

        const response = await this.send(this.registry.operations.GetDevicePropDesc, {
            DevicePropCode: property.code,
        })

        if (!('data' in response) || !response.data) {
            throw new Error('No data received from GetDevicePropDesc')
        }

        // Cast needed: TypeScript knows data exists but can't narrow to specific property's codec type
        return response.data as CodecType<P['codec']>
    }

    async set<P extends PropertyDefinition>(property: P, value: CodecType<P['codec']>): Promise<void> {
        if (!property.access.includes('Set')) {
            throw new Error(`Property ${property.name} is not writable`)
        }

        const codec = this.resolveCodec(property.codec)
        const encodedValue = codec.encode(value)

        await this.send(this.registry.operations.SetDevicePropValue, { DevicePropCode: property.code }, encodedValue)
    }

    on<E extends { name: string }>(event: E, handler: (event: EventData) => void): void {
        this.emitter.on(event.name, handler)
    }

    off<E extends { name: string }>(event: E, handler?: (event: EventData) => void): void {
        if (handler) {
            this.emitter.off(event.name, handler)
        } else {
            this.emitter.removeAllListeners(event.name)
        }
    }

    async getAperture(): Promise<string> {
        return this.get(this.registry.properties.FNumber)
    }

    async setAperture(value: string): Promise<void> {
        return this.set(this.registry.properties.FNumber, value)
    }

    async getShutterSpeed(): Promise<string> {
        return this.get(this.registry.properties.ExposureTime)
    }

    async setShutterSpeed(value: string): Promise<void> {
        return this.set(this.registry.properties.ExposureTime, value)
    }

    async getIso(): Promise<string> {
        return this.get(this.registry.properties.ExposureIndex)
    }

    async setIso(value: string): Promise<void> {
        return this.set(this.registry.properties.ExposureIndex, value)
    }

    async captureImage(): Promise<{ info: ObjectInfo; data: Uint8Array } | null> {
        await this.send(this.registry.operations.InitiateCapture, {})
        throw new Error('Image retrieval after capture not implemented in generic camera')
    }

    async captureLiveView(): Promise<Uint8Array> {
        throw new Error('Live view capture not supported on generic PTP cameras')
    }

    async startRecording(): Promise<void> {
        throw new Error('Video recording not supported on generic PTP cameras')
    }

    async stopRecording(): Promise<void> {
        throw new Error('Video recording not supported on generic PTP cameras')
    }

    public resolveCodec<T>(codec: CodecDefinition<T> | CodecDefinition<any>): CodecInstance<T> {
        if (typeof codec === 'function') {
            return codec(this.registry)
        }

        return codec
    }

    protected handleEvent(event: PTPEvent): void {
        const eventDef = Object.values(this.registry.events).find((e: any) => e.code === event.code)
        console.log('Event Received:', eventDef, event.parameters)
        if (!eventDef) return

        this.emitter.emit(eventDef.name, event.parameters)
    }

    private getNextTransactionId(): number {
        this.transactionId = (this.transactionId + 1) & 0xffffffff
        if (this.transactionId === 0) this.transactionId = 1
        return this.transactionId
    }

    private buildCommand(code: number, transactionId: number, params: Uint8Array[]): Uint8Array {
        const u16 = this.registry.codecs.uint16
        const u32 = this.registry.codecs.uint32

        const paramBytes = params.reduce((sum, p) => sum + p.length, 0)
        const length = 12 + paramBytes

        const parts: Uint8Array[] = [
            u32.encode(length),
            u16.encode(1),
            u16.encode(code),
            u32.encode(transactionId),
            ...params,
        ]

        const buffer = new Uint8Array(length)
        let offset = 0
        for (const part of parts) {
            buffer.set(part, offset)
            offset += part.length
        }

        return buffer
    }

    private buildData(code: number, transactionId: number, data: Uint8Array): Uint8Array {
        const u16 = this.registry.codecs.uint16
        const u32 = this.registry.codecs.uint32

        const length = 12 + data.length

        const parts: Uint8Array[] = [
            u32.encode(length),
            u16.encode(2),
            u16.encode(code),
            u32.encode(transactionId),
            data,
        ]

        const buffer = new Uint8Array(length)
        let offset = 0
        for (const part of parts) {
            buffer.set(part, offset)
            offset += part.length
        }

        return buffer
    }

    private parseContainer(data: Uint8Array): {
        type: number
        code: number
        transactionId: number
        payload: Uint8Array
    } {
        if (data.length < 12) {
            throw new Error(`Container too short: ${data.length} bytes`)
        }

        const u16 = this.registry.codecs.uint16
        const u32 = this.registry.codecs.uint32

        let offset = 0

        const lengthResult = u32.decode(data, offset)
        const length = lengthResult.value
        offset += lengthResult.bytesRead

        const typeResult = u16.decode(data, offset)
        const type = typeResult.value
        offset += typeResult.bytesRead

        const codeResult = u16.decode(data, offset)
        const code = codeResult.value
        offset += codeResult.bytesRead

        const transactionIdResult = u32.decode(data, offset)
        const transactionId = transactionIdResult.value
        offset += transactionIdResult.bytesRead

        const payload = data.slice(offset)

        return { type, code, transactionId, payload }
    }
}

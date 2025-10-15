import { Box, Text } from 'ink'
import Spinner from 'ink-spinner'
import React from 'react'
import { OK, responseRegistry } from '../../ptp/definitions/response-definitions'
import { ConsoleLog, Logger, PTPOperationLog, PTPTransferLog, USBTransferLog } from '../logger'
import { formatBytes } from './formatters/bytes-formatter'
import { formatJSON } from './formatters/compact-formatter'
import { safeStringify } from './formatters/safe-stringify'

const responseDefinitions = Object.values(responseRegistry)

interface InkLoggerProps {
    logger: Logger
}

interface TransactionGroup {
    key: string
    sessionId?: number
    transactionId?: number
    ptpLog?: PTPOperationLog | PTPTransferLog
    consoleLog?: ConsoleLog
    usbLogs: USBTransferLog[]
    timestamp: number
}

export function InkLogger({ logger }: InkLoggerProps) {
    const [updateCount, forceUpdate] = React.useReducer(x => x + 1, 0)

    React.useEffect(() => {
        const listener = () => forceUpdate()
        logger.onChange(listener)
    }, [logger])

    const allLogs = logger.getLogs()
    const grouped = new Map<string, TransactionGroup>()

    for (const log of allLogs) {
        if (log.type === 'console') {
            const key = `console:${log.id}`
            grouped.set(key, {
                key,
                consoleLog: log,
                usbLogs: [],
                timestamp: log.timestamp,
            })
        } else {
            const key = `${log.sessionId}:${log.transactionId}`

            if (!grouped.has(key)) {
                grouped.set(key, {
                    key,
                    sessionId: log.sessionId,
                    transactionId: log.transactionId,
                    usbLogs: [],
                    timestamp: log.timestamp,
                })
            }

            const group = grouped.get(key)!
            if (log.type === 'ptp_operation' || log.type === 'ptp_transfer') {
                group.ptpLog = log
            } else if (log.type === 'usb_transfer') {
                group.usbLogs.push(log)
            }
        }
    }

    const allGroups = Array.from(grouped.values()).sort((a, b) => a.timestamp - b.timestamp)

    const config = logger.getConfig()

    return (
        <Box flexDirection="column" rowGap={1}>
            {allGroups.map(group => {
                if (group.consoleLog) {
                    const consoleLog = group.consoleLog
                    const colorMap = {
                        log: 'cyan',
                        info: 'cyan',
                        warn: 'yellow',
                        error: 'red',
                    } as const
                    const color = colorMap[consoleLog.consoleLevel]
                    const levelLabel =
                        consoleLog.consoleLevel === 'log'
                            ? 'Debug'
                            : consoleLog.consoleLevel.charAt(0).toUpperCase() + consoleLog.consoleLevel.slice(1)
                    const formatted = consoleLog.args
                        .map(arg => (typeof arg === 'object' ? safeStringify(arg) : String(arg)))
                        .join(' ')

                    const date = new Date(consoleLog.timestamp)
                    const hours24 = date.getHours()
                    const hours = hours24 % 12 || 12
                    const minutes = date.getMinutes().toString().padStart(2, '0')
                    const seconds = date.getSeconds().toString().padStart(2, '0')
                    const millis = date.getMilliseconds().toString().padStart(3, '0')
                    const ampm = hours24 >= 12 ? 'PM' : 'AM'
                    const timestamp = `${hours}:${minutes}:${seconds}.${millis} ${ampm}`

                    return (
                        <Box key={group.key} flexDirection="column">
                            <Text>
                                <Text bold>{timestamp} [</Text>
                                <Text color={color} bold>
                                    {levelLabel}
                                </Text>
                                <Text bold>] </Text>
                                <Text>{formatted}</Text>
                            </Text>
                        </Box>
                    )
                }

                if (!group.ptpLog) return null

                const ptpLog = group.ptpLog
                const operationName = ptpLog.requestPhase.operationName

                const hasError = ptpLog.responsePhase && ptpLog.responsePhase.code !== OK.code
                const isSuccess = ptpLog.responsePhase && ptpLog.responsePhase.code === OK.code
                const isRunning = !ptpLog.responsePhase

                const startTime = ptpLog.requestPhase.timestamp
                const endTime = ptpLog.responsePhase?.timestamp || Date.now()

                let duration: number
                let dataPhaseTime: number
                let responsePhaseTime: number
                let transferChunks: Array<{ transactionId: number; timestamp: number; offset: number; bytes: number }> =
                    []
                let totalBytes = 0
                let transferredBytes = 0

                if (ptpLog.type === 'ptp_transfer') {
                    transferChunks = ptpLog.chunks
                    totalBytes = ptpLog.totalBytes
                    transferredBytes = ptpLog.transferredBytes

                    const firstChunkTime = transferChunks[0]?.timestamp || startTime
                    const lastChunkTime = transferChunks[transferChunks.length - 1]?.timestamp || Date.now()
                    dataPhaseTime = lastChunkTime - firstChunkTime
                    responsePhaseTime = ptpLog.responsePhase ? ptpLog.responsePhase.timestamp - lastChunkTime : 0
                    duration = endTime - startTime
                } else {
                    duration = endTime - startTime
                    dataPhaseTime = ptpLog.dataPhase ? ptpLog.dataPhase.timestamp - ptpLog.requestPhase.timestamp : 0
                    responsePhaseTime = ptpLog.responsePhase
                        ? ptpLog.responsePhase.timestamp -
                          (ptpLog.dataPhase?.timestamp || ptpLog.requestPhase.timestamp)
                        : 0
                }

                const date = new Date(ptpLog.timestamp)
                const hours24 = date.getHours()
                const hours = hours24 % 12 || 12
                const minutes = date.getMinutes().toString().padStart(2, '0')
                const seconds = date.getSeconds().toString().padStart(2, '0')
                const millis = date.getMilliseconds().toString().padStart(3, '0')
                const ampm = hours24 >= 12 ? 'PM' : 'AM'
                const timestamp = `${hours}:${minutes}:${seconds}.${millis} ${ampm}`

                const statusSymbol = hasError ? '✗' : isSuccess ? '✓' : '⋯'
                const statusColor = hasError ? 'red' : isSuccess ? 'green' : 'yellow'

                return (
                    <Box key={group.key} flexDirection="column">
                        <Box>
                            <Text bold>{timestamp} </Text>
                            <Text color="blue" bold>
                                {operationName}{' '}
                            </Text>
                            <Text bold>{isRunning ? 'running' : 'ran for'} </Text>
                            {isRunning ? (
                                <Text color="magenta" bold>
                                    <Spinner type="dots" />{' '}
                                </Text>
                            ) : (
                                <>
                                    <Text color="magenta" bold>
                                        {duration}ms{' '}
                                    </Text>
                                    <Text color={statusColor} bold>
                                        {statusSymbol}
                                    </Text>
                                </>
                            )}
                        </Box>
                        <Text dimColor>
                            {' '}
                            ├─ Session 0x{group.sessionId!.toString(16)}, transaction {group.transactionId}
                        </Text>
                        <Text dimColor> │</Text>

                        <Text>
                            <Text dimColor> {ptpLog.dataPhase || ptpLog.responsePhase ? '├─' : '└─'} </Text>
                            <Text>Sent </Text>
                            <Text color="blue" bold>
                                request
                            </Text>
                            <Text> in </Text>
                            <Text color="magenta" bold>
                                0ms
                            </Text>
                        </Text>
                        {Object.keys(ptpLog.requestPhase.decodedParams).length === 0 ? (
                            <Text>
                                <Text dimColor> │</Text>{'     '}(no parameters)
                            </Text>
                        ) : (
                            Object.entries(ptpLog.requestPhase.decodedParams).map(([key, value]) => {
                                const formattedValue =
                                    typeof value === 'number' ? `0x${value.toString(16)}` : safeStringify(value)
                                return (
                                    <Text key={key}>
                                        <Text dimColor> │</Text>{'     '}
                                        {key} set to {formattedValue}
                                    </Text>
                                )
                            })
                        )}
                        {config.showEncodedData &&
                            ptpLog.requestPhase.encodedParams?.map((encoded, idx) => {
                                const hex = Array.from(encoded.slice(0, 16))
                                    .map(b => b.toString(16).padStart(2, '0'))
                                    .join(' ')
                                return (
                                    <Text key={idx}>
                                        <Text dimColor> │</Text>{'     '}Bytes encoded as [{hex}
                                        {encoded.length > 16 ? '...' : ''}]
                                    </Text>
                                )
                            })}
                        {!config.collapseUSB &&
                            group.usbLogs
                                .filter(u => u.phase === 'request')
                                .map(usbLog => {
                                    const direction = usbLog.direction === 'send' ? 'to' : 'from'
                                    return (
                                        <Text key={usbLog.id}>
                                            <Text dimColor> │</Text>{'     '}Transferred {formatBytes(usbLog.bytes)} via USB{' '}
                                            {direction} {usbLog.endpoint} {usbLog.endpointAddress}
                                        </Text>
                                    )
                                })}

                        {ptpLog.dataPhase ? (
                            <>
                                <Text dimColor> │</Text>
                                <Text>
                                    <Text dimColor> {ptpLog.responsePhase ? '├─' : '└─'} </Text>
                                    <Text>{ptpLog.dataPhase.direction === 'in' ? 'Sent' : 'Received'} </Text>
                                    <Text color="blue" bold>
                                        data
                                    </Text>
                                    <Text> in </Text>
                                    <Text color="magenta" bold>
                                        {dataPhaseTime}ms
                                    </Text>
                                </Text>
                                {ptpLog.type === 'ptp_transfer' &&
                                    (() => {
                                        const percent = totalBytes > 0 ? (transferredBytes / totalBytes) * 100 : 0
                                        const barLength = 30
                                        const filledLength = Math.round((percent / 100) * barLength)
                                        const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength)

                                        const avgChunkSize =
                                            transferChunks.length > 0 ? transferredBytes / transferChunks.length : 0

                                        let speedText = ''
                                        if (transferChunks.length >= 2) {
                                            const lastChunk = transferChunks[transferChunks.length - 1]
                                            const prevChunk = transferChunks[transferChunks.length - 2]
                                            const timeDiff = (lastChunk.timestamp - prevChunk.timestamp) / 1000 // seconds
                                            if (timeDiff > 0) {
                                                const bytesPerSecond = lastChunk.bytes / timeDiff
                                                speedText = `${formatBytes(bytesPerSecond, 1)}/s`
                                            }
                                        }

                                        return (
                                            <>
                                                <Text>
                                                    <Text dimColor> │</Text>{'     '}
                                                    <Text color="blue">{bar}</Text>
                                                    <Text> {percent.toFixed(1)}%</Text>
                                                </Text>
                                                <Text>
                                                    <Text dimColor> │</Text>{'     '}
                                                    <Text>
                                                        {speedText} ({formatBytes(totalBytes)} total,{' '}
                                                        {transferChunks.length} chunks @ {formatBytes(avgChunkSize, 0)}{' '}
                                                        each)
                                                    </Text>
                                                </Text>
                                            </>
                                        )
                                    })()}
                                {config.showDecodedData &&
                                    ptpLog.dataPhase.decodedData !== undefined &&
                                    ptpLog.dataPhase.decodedData !== null &&
                                    (() => {
                                        const formattedLines = formatJSON(ptpLog.dataPhase.decodedData, 0)

                                        return formattedLines.map((line, idx) => (
                                            <Text key={idx}>
                                                <Text dimColor> │</Text>{'     '}
                                                {line}
                                            </Text>
                                        ))
                                    })()}
                                {config.showEncodedData && ptpLog.dataPhase.encodedData && (
                                    <Text>
                                        <Text dimColor> │</Text>{'     '}Bytes encoded as [
                                        {Array.from(ptpLog.dataPhase.encodedData.slice(0, 16))
                                            .map(b => b.toString(16).padStart(2, '0'))
                                            .join(' ')}
                                        {ptpLog.dataPhase.encodedData.length > 16 ? '...' : ''}]
                                    </Text>
                                )}
                                {!config.collapseUSB &&
                                    (() => {
                                        const dataUsbLogs = group.usbLogs.filter(u => u.phase === 'data')

                                        if (ptpLog.type === 'ptp_transfer' && dataUsbLogs.length > 0) {
                                            const aggTransferredBytes = transferredBytes
                                            const direction = dataUsbLogs[0].direction === 'send' ? 'to' : 'from'
                                            const endpoint = dataUsbLogs[0].endpoint
                                            const endpointAddress = dataUsbLogs[0].endpointAddress

                                            return (
                                                <Text key="aggregate-usb">
                                                    <Text dimColor> │</Text>{'     '}Transferred {formatBytes(totalBytes)} via USB{' '}
                                                    {direction} {endpoint} {endpointAddress}
                                                </Text>
                                            )
                                        }

                                        return dataUsbLogs.map(usbLog => {
                                            const direction = usbLog.direction === 'send' ? 'to' : 'from'
                                            return (
                                                <Text key={usbLog.id}>
                                                    <Text dimColor> │</Text>{'     '}Transferred {formatBytes(usbLog.bytes)} via USB{' '}
                                                    {direction} {usbLog.endpoint} {usbLog.endpointAddress}
                                                </Text>
                                            )
                                        })
                                    })()}
                            </>
                        ) : !ptpLog.responsePhase ? (
                            <>
                                <Text dimColor> │</Text>
                                <Text>
                                    <Text dimColor> └─ </Text>
                                    <Text>Receiving </Text>
                                    <Text color="blue" bold>
                                        data
                                    </Text>
                                    <Text> </Text>
                                    <Text color="magenta" bold>
                                        <Spinner type="dots" />
                                    </Text>
                                </Text>
                            </>
                        ) : null}

                        {ptpLog.responsePhase ? (
                            <>
                                <Text dimColor> │</Text>
                                <Text>
                                    <Text dimColor> └─ </Text>
                                    <Text>Received </Text>
                                    <Text color={hasError ? 'red' : 'green'} bold>
                                        response
                                    </Text>
                                    <Text> in </Text>
                                    <Text color="magenta" bold>
                                        {responsePhaseTime}ms
                                    </Text>
                                </Text>
                                <Text>
                                    {'       '}Response code: {hasError ? 'error' : 'ok'} (0x
                                    {ptpLog.responsePhase.code.toString(16)})
                                    {(() => {
                                        const responseDef = responseDefinitions.find(
                                            r => r.code === ptpLog.responsePhase!.code
                                        )
                                        return responseDef ? ` - ${responseDef.description}` : ''
                                    })()}
                                </Text>
                                {!config.collapseUSB &&
                                    group.usbLogs
                                        .filter(u => u.phase === 'response')
                                        .map(usbLog => {
                                            const direction = usbLog.direction === 'send' ? 'to' : 'from'
                                            return (
                                                <Text key={usbLog.id}>
                                                    {'       '}Transferred {formatBytes(usbLog.bytes)} via USB{' '}
                                                    {direction} {usbLog.endpoint} {usbLog.endpointAddress}
                                                </Text>
                                            )
                                        })}
                            </>
                        ) : (
                            <>
                                <Text dimColor> │</Text>
                                <Text>
                                    <Text dimColor> └─ </Text>
                                    <Text>Receiving </Text>
                                    <Text color="blue" bold>
                                        response
                                    </Text>
                                    <Text> </Text>
                                    <Text color="magenta" bold>
                                        <Spinner type="dots" />
                                    </Text>
                                </Text>
                            </>
                        )}
                    </Box>
                )
            })}
        </Box>
    )
}

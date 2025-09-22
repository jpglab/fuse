module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/dist/web.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** */ __turbopack_context__.s([
    "AFAreaMode",
    ()=>de,
    "Camera",
    ()=>J,
    "ColorSpace",
    ()=>fe,
    "DataType",
    ()=>ee,
    "DeviceProperty",
    ()=>y,
    "DriveMode",
    ()=>ce,
    "EndpointType",
    ()=>K,
    "ExposureModeEnum",
    ()=>ie,
    "FlashMode",
    ()=>ue,
    "FocusMode",
    ()=>ae,
    "FocusStatus",
    ()=>re,
    "Frame",
    ()=>X,
    "FrameFormat",
    ()=>z,
    "ImageFormat",
    ()=>L,
    "ImageQuality",
    ()=>pe,
    "MessageType",
    ()=>W,
    "MeteringMode",
    ()=>me,
    "PTPDataType",
    ()=>j,
    "Photo",
    ()=>D,
    "PropertyUnit",
    ()=>te,
    "WhiteBalanceMode",
    ()=>se,
    "listCameras",
    ()=>B,
    "requestCameraAccess",
    ()=>Ie,
    "watchCameras",
    ()=>Te
]);
var W = ((n)=>(n[n.COMMAND = 1] = "COMMAND", n[n.DATA = 2] = "DATA", n[n.RESPONSE = 3] = "RESPONSE", n[n.EVENT = 4] = "EVENT", n))(W || {}), j = ((c)=>(c[c.UINT8 = 1] = "UINT8", c[c.UINT16 = 3] = "UINT16", c[c.UINT32 = 5] = "UINT32", c[c.UINT64 = 7] = "UINT64", c[c.INT8 = 2] = "INT8", c[c.INT16 = 4] = "INT16", c[c.INT32 = 6] = "INT32", c[c.INT64 = 8] = "INT64", c[c.STRING = 65535] = "STRING", c[c.ARRAY = 16384] = "ARRAY", c))(j || {});
var g = {
    COMMAND_BLOCK: 1,
    DATA_BLOCK: 2,
    RESPONSE_BLOCK: 3,
    EVENT_BLOCK: 4
}, m = {
    GET_DEVICE_INFO: 4097,
    OPEN_SESSION: 4098,
    CLOSE_SESSION: 4099,
    GET_STORAGE_IDS: 4100,
    GET_STORAGE_INFO: 4101,
    GET_NUM_OBJECTS: 4102,
    GET_OBJECT_HANDLES: 4103,
    GET_OBJECT_INFO: 4104,
    GET_OBJECT: 4105,
    GET_THUMB: 4106,
    DELETE_OBJECT: 4107,
    SEND_OBJECT_INFO: 4108,
    SEND_OBJECT: 4109,
    INITIATE_CAPTURE: 4110,
    FORMAT_STORE: 4111,
    RESET_DEVICE: 4112,
    SELF_TEST: 4113,
    SET_OBJECT_PROTECTION: 4114,
    POWER_DOWN: 4115,
    GET_DEVICE_PROP_DESC: 4116,
    GET_DEVICE_PROP_VALUE: 4117,
    SET_DEVICE_PROP_VALUE: 4118,
    RESET_DEVICE_PROP_VALUE: 4119,
    TERMINATE_OPEN_CAPTURE: 4120,
    MOVE_OBJECT: 4121,
    COPY_OBJECT: 4122,
    GET_PARTIAL_OBJECT: 4123,
    INITIATE_OPEN_CAPTURE: 4124
}, l = {
    UNDEFINED: 8192,
    OK: 8193,
    GENERAL_ERROR: 8194,
    SESSION_NOT_OPEN: 8195,
    INVALID_TRANSACTION_ID: 8196,
    OPERATION_NOT_SUPPORTED: 8197,
    PARAMETER_NOT_SUPPORTED: 8198,
    INCOMPLETE_TRANSFER: 8199,
    INVALID_STORAGE_ID: 8200,
    INVALID_OBJECT_HANDLE: 8201,
    DEVICE_PROP_NOT_SUPPORTED: 8202,
    INVALID_OBJECT_FORMAT_CODE: 8203,
    STORAGE_FULL: 8204,
    OBJECT_WRITE_PROTECTED: 8205,
    STORE_READ_ONLY: 8206,
    ACCESS_DENIED: 8207,
    NO_THUMBNAIL_PRESENT: 8208,
    SELF_TEST_FAILED: 8209,
    PARTIAL_DELETION: 8210,
    STORE_NOT_AVAILABLE: 8211,
    SPECIFICATION_BY_FORMAT_UNSUPPORTED: 8212,
    NO_VALID_OBJECT_INFO: 8213,
    INVALID_CODE_FORMAT: 8214,
    UNKNOWN_VENDOR_CODE: 8215,
    CAPTURE_ALREADY_TERMINATED: 8216,
    DEVICE_BUSY: 8217,
    INVALID_PARENT_OBJECT: 8218,
    INVALID_DEVICE_PROP_FORMAT: 8219,
    INVALID_DEVICE_PROP_VALUE: 8220,
    INVALID_PARAMETER: 8221,
    SESSION_ALREADY_OPEN: 8222,
    TRANSACTION_CANCELLED: 8223,
    SPECIFICATION_OF_DESTINATION_UNSUPPORTED: 8224
}, he = {
    UNDEFINED: 16384,
    CANCEL_TRANSACTION: 16385,
    OBJECT_ADDED: 16386,
    OBJECT_REMOVED: 16387,
    STORE_ADDED: 16388,
    STORE_REMOVED: 16389,
    DEVICE_PROP_CHANGED: 16390,
    OBJECT_INFO_CHANGED: 16391,
    DEVICE_INFO_CHANGED: 16392,
    REQUEST_OBJECT_TRANSFER: 16393,
    STORE_FULL: 16394,
    DEVICE_RESET: 16395,
    STORAGE_INFO_CHANGED: 16396,
    CAPTURE_COMPLETE: 16397,
    UNREPORTED_STATUS: 16398
}, T = {
    UNDEFINED: 20480,
    BATTERY_LEVEL: 20481,
    FUNCTIONAL_MODE: 20482,
    IMAGE_SIZE: 20483,
    COMPRESSION_SETTING: 20484,
    WHITE_BALANCE: 20485,
    RGB_GAIN: 20486,
    F_NUMBER: 20487,
    FOCAL_LENGTH: 20488,
    FOCUS_DISTANCE: 20489,
    FOCUS_MODE: 20490,
    EXPOSURE_METERING_MODE: 20491,
    FLASH_MODE: 20492,
    EXPOSURE_TIME: 20493,
    EXPOSURE_PROGRAM_MODE: 20494,
    EXPOSURE_INDEX: 20495,
    EXPOSURE_BIAS_COMPENSATION: 20496,
    DATE_TIME: 20497,
    CAPTURE_DELAY: 20498,
    STILL_CAPTURE_MODE: 20499,
    CONTRAST: 20500,
    SHARPNESS: 20501,
    DIGITAL_ZOOM: 20502,
    EFFECT_MODE: 20503,
    BURST_NUMBER: 20504,
    BURST_INTERVAL: 20505,
    TIMELAPSE_NUMBER: 20506,
    TIMELAPSE_INTERVAL: 20507,
    FOCUS_METERING_MODE: 20508,
    UPLOAD_URL: 20509,
    ARTIST: 20510,
    COPYRIGHT_INFO: 20511
}, ge = Object.entries(m).reduce((s, [e, t])=>(s[t] = e, s), {}), Se = Object.entries(l).reduce((s, [e, t])=>(s[t] = e, s), {}), _e = Object.entries(he).reduce((s, [e, t])=>(s[t] = e, s), {}), Pe = Object.entries(T).reduce((s, [e, t])=>(s[t] = e, s), {});
var x = class extends Error {
    constructor(t, r, n){
        super(r);
        this.code = t;
        this.operation = n;
        this.name = "PTPError";
    }
};
var v = class {
    transactionId = 0;
    getNextTransactionId() {
        return this.transactionId++, this.transactionId > 4294967295 && (this.transactionId = 1), this.transactionId;
    }
    buildCommand(e, t = []) {
        let r = t.length, n = 12 + r * 4, o = new ArrayBuffer(n), i = new DataView(o);
        i.setUint32(0, n, !0), i.setUint16(4, g.COMMAND_BLOCK, !0), i.setUint16(6, e, !0), i.setUint32(8, this.getNextTransactionId(), !0);
        for(let a = 0; a < Math.min(r, 5); a++){
            let f = t[a];
            f !== void 0 && i.setUint32(12 + a * 4, f, !0);
        }
        return new Uint8Array(o);
    }
    buildData(e, t) {
        let r = 12 + t.byteLength, n = new ArrayBuffer(r), o = new DataView(n);
        o.setUint32(0, r, !0), o.setUint16(4, g.DATA_BLOCK, !0), o.setUint16(6, e, !0), o.setUint32(8, this.transactionId, !0);
        let i = new Uint8Array(n);
        return i.set(t, 12), i;
    }
    parseResponse(e) {
        if (e.byteLength < 12) throw new Error("Invalid response: too short");
        let t = new DataView(e.buffer, e.byteOffset, e.byteLength), r = t.getUint32(0, !0), n = t.getUint16(4, !0), o = t.getUint16(6, !0), i = t.getUint32(8, !0), a = [], f = r - 12;
        if (f > 0 && f <= 20) {
            let p = f / 4;
            for(let c = 0; c < p; c++)a.push(t.getUint32(12 + c * 4, !0));
        }
        return {
            code: o,
            sessionId: 0,
            transactionId: i,
            parameters: a,
            type: this.mapContainerTypeToMessageType(n)
        };
    }
    parseEvent(e) {
        if (e.byteLength < 12) throw new Error("Invalid event: too short");
        let t = new DataView(e.buffer, e.byteOffset, e.byteLength), r = t.getUint32(0, !0);
        t.getUint16(4, !0);
        let n = t.getUint16(6, !0), o = t.getUint32(8, !0), i = [], a = r - 12;
        if (a > 0 && a <= 12) {
            let f = a / 4;
            for(let p = 0; p < f; p++)i.push(t.getUint32(12 + p * 4, !0));
        }
        return {
            code: n,
            sessionId: 0,
            transactionId: o,
            parameters: i
        };
    }
    parseData(e) {
        if (e.byteLength < 12) throw new Error("Invalid data: too short");
        let t = new DataView(e.buffer, e.byteOffset, e.byteLength);
        t.getUint32(0, !0), t.getUint16(4, !0), t.getUint16(6, !0);
        let r = t.getUint32(8, !0), n = new Uint8Array(e.buffer, e.byteOffset + 12, e.byteLength - 12);
        return {
            sessionId: 0,
            transactionId: r,
            payload: n
        };
    }
    mapContainerTypeToMessageType(e) {
        switch(e){
            case g.COMMAND_BLOCK:
                return 1;
            case g.DATA_BLOCK:
                return 2;
            case g.RESPONSE_BLOCK:
                return 3;
            case g.EVENT_BLOCK:
                return 4;
            default:
                throw new Error(`Unknown container type: 0x${e.toString(16)}`);
        }
    }
    parseMessage(e) {
        if (e.byteLength < 12) throw new Error("Invalid message: too short");
        let r = new DataView(e.buffer, e.byteOffset, e.byteLength).getUint16(4, !0);
        switch(r){
            case g.COMMAND_BLOCK:
                return {
                    type: 1,
                    message: this.parseResponse(e)
                };
            case g.DATA_BLOCK:
                return {
                    type: 2,
                    message: this.parseData(e)
                };
            case g.RESPONSE_BLOCK:
                return {
                    type: 3,
                    message: this.parseResponse(e)
                };
            case g.EVENT_BLOCK:
                return {
                    type: 4,
                    message: this.parseEvent(e)
                };
            default:
                throw new Error(`Unknown message type: 0x${r.toString(16)}`);
        }
    }
    resetTransactionId() {
        this.transactionId = 0;
    }
    getCurrentTransactionId() {
        return this.transactionId;
    }
};
var I = {
    ...m,
    SDIO_CONNECT: 37377,
    SDIO_GET_EXT_DEVICE_INFO: 37378,
    SET_DEVICE_PROPERTY_VALUE: 37381,
    CONTROL_DEVICE_PROPERTY: 37383,
    GET_ALL_EXT_DEVICE_PROP_INFO: 37385,
    SDIO_GET_OSD_IMAGE: 37432
}, d = {
    ...T,
    F_NUMBER: 20487,
    ISO_STANDARD: 20495,
    STILL_CAPTURE_MODE: 20499,
    OSD_IMAGE_MODE: 53767,
    SHUTTER_SPEED: 53773,
    CAPTURE_STATUS: 53781,
    ISO_SENSITIVITY_ALT1: 53789,
    ISO_SENSITIVITY: 53790,
    ISO_SENSITIVITY_ALT2: 53791,
    ISO_SENSITIVITY_ALT3: 53792,
    LIVE_VIEW_STATUS: 53793,
    SAVE_MEDIA: 53794,
    DIAL_MODE: 53850,
    SHUTTER_BUTTON_CONTROL: 53953,
    FOCUS_BUTTON_CONTROL: 53954,
    LIVE_VIEW_CONTROL: 54035
}, C = {
    INITIAL_HANDSHAKE: 1,
    CAPABILITY_EXCHANGE: 2,
    FINAL_AUTHENTICATION: 3
}, E = {
    VENDOR_ID: 1356,
    PRODUCT_ID: 2415,
    PRODUCT_ID_ALPHA: 3704,
    PROTOCOL_VERSION: 300,
    DEVICE_PROPERTY_OPTION: 1,
    LIVE_VIEW_IMAGE_HANDLE: 4294950914,
    OSD_IMAGE_HANDLE: 4294950916,
    LIVE_VIEW_ENABLE: 2,
    LIVE_VIEW_DISABLE: 1,
    SHOT_IMAGE_DATASET: 4294950915,
    OSD_DATASET: 4294950918,
    SHUTTER_HALF_PRESS: 2,
    SHUTTER_FULL_PRESS: 1,
    FOCUS_HALF_PRESS: 2,
    FOCUS_RELEASE: 1,
    DIAL_MODE_HOST: 1,
    STILL_CAPTURE_MODE: 1,
    SAVE_MEDIA_HOST: 1,
    OSD_MODE_ON: 1,
    OSD_MODE_OFF: 0,
    ACCESS_DENIED: 8207,
    RECENT_IMAGE_HANDLE: 4294950913,
    GET_ALL_DATA: 0,
    ENABLE_EXTENDED: 1,
    DATA_TYPE_MIN: 1,
    DATA_TYPE_MAX: 10,
    DATA_TYPE_ARRAY_MIN: 16385,
    DATA_TYPE_ARRAY_MAX: 16394,
    DATA_TYPE_STRING: 65535,
    PTP_PROP_MIN: 20480,
    PTP_PROP_MAX: 24575,
    VENDOR_PROP_MIN: 53248,
    VENDOR_PROP_MAX: 57343
};
function q(s) {
    return `f/${(s / 100).toFixed(1)}`;
}
function Z(s) {
    if (s === 0) return "BULB";
    if (s === 4294967295) return "N/A";
    let e = s >> 16 & 65535, t = s & 65535;
    return t === 10 ? `${e / 10}"` : e === 1 ? `1/${t}` : `${e}/${t}`;
}
function Q(s) {
    if (s === 16777215) return "ISO AUTO";
    if (s === 33554431) return "Multi Frame NR ISO AUTO";
    if (s === 50331647) return "Multi Frame NR High ISO AUTO";
    let e = s >> 24 & 255, t = "";
    e === 1 ? t = "Multi Frame NR " : e === 2 && (t = "Multi Frame NR High ");
    let r = s & 16777215;
    return r >= 10 && r <= 1e6 ? `${t}ISO ${r}` : "ISO Unknown";
}
var R = class s {
    constructor(e, t){
        this.transport = e;
        this.messageBuilder = t;
    }
    sessionId = null;
    isOpen = !1;
    async openSession(e) {
        if (console.log(`PTP Protocol: Opening session with ID ${e}`), this.isOpen) {
            console.log("PTP Protocol: Session already marked as open locally");
            return;
        }
        let t = this.messageBuilder.buildCommand(m.OPEN_SESSION, [
            e
        ]);
        console.log("PTP Protocol: Sending OpenSession command..."), await this.transport.send(t), console.log("PTP Protocol: OpenSession command sent, waiting for response...");
        let r = await this.transport.receive(512), n = this.messageBuilder.parseResponse(r);
        if (console.log(`PTP Protocol: OpenSession response received: 0x${n.code.toString(16)}`), n.code === l.SESSION_ALREADY_OPEN) {
            console.log("PTP Protocol: Camera says session already open, continuing..."), this.sessionId = e, this.isOpen = !0;
            return;
        }
        if (n.code !== l.OK) throw new x(n.code, `Failed to open session: 0x${n.code.toString(16).padStart(4, "0")}`, "OpenSession");
        this.sessionId = e, this.isOpen = !0;
    }
    async closeSession() {
        if (this.isOpen) try {
            let e = this.messageBuilder.buildCommand(m.CLOSE_SESSION);
            await this.transport.send(e);
            let t = await this.transport.receive(512), r = this.messageBuilder.parseResponse(t);
            r.code !== l.OK && r.code !== l.SESSION_NOT_OPEN && console.warn(`CloseSession returned: 0x${r.code.toString(16).padStart(4, "0")}`);
        } finally{
            this.sessionId = null, this.isOpen = !1;
        }
    }
    async sendOperation(e) {
        if (!this.isOpen && e.code !== m.GET_DEVICE_INFO) throw new x(l.SESSION_NOT_OPEN, "Session not open", "SendOperation");
        let t = this.messageBuilder.getNextTransactionId(), r = e.hasDataPhase !== void 0 ? e.hasDataPhase : s.expectsDataIn(e.code) || e.data !== void 0, n = this.messageBuilder.buildCommand(e.code, e.parameters || []);
        await this.transport.send(n);
        let o;
        if (r && e.data) {
            let p = this.messageBuilder.buildData(e.code, e.data);
            await this.transport.send(p);
        } else if (r) {
            let p = e.maxDataLength || 65536, c = await this.transport.receive(p);
            o = this.messageBuilder.parseData(c).payload;
        }
        let i = await this.transport.receive(512), a = this.messageBuilder.parseResponse(i);
        return {
            code: a.code,
            sessionId: this.sessionId || 0,
            transactionId: t,
            parameters: a.parameters,
            data: o
        };
    }
    async receiveEvent() {
        let e = await this.transport.receive(512), t = this.messageBuilder.parseEvent(e);
        return {
            code: t.code,
            sessionId: this.sessionId || 0,
            transactionId: t.transactionId,
            parameters: t.parameters
        };
    }
    getSessionId() {
        return this.sessionId;
    }
    isSessionOpen() {
        return this.isOpen;
    }
    async reset() {
        this.isOpen && await this.closeSession(), this.messageBuilder.resetTransactionId(), this.sessionId = null, this.isOpen = !1;
    }
    async getDeviceInfo() {
        return this.sendOperation({
            code: m.GET_DEVICE_INFO,
            hasDataPhase: !0
        });
    }
    async sendCommand(e, t) {
        return this.sendOperation({
            code: e,
            parameters: t,
            hasDataPhase: !1
        });
    }
    async sendCommandReceiveData(e, t) {
        return this.sendOperation({
            code: e,
            parameters: t,
            hasDataPhase: !0
        });
    }
    async sendCommandWithData(e, t, r) {
        return this.sendOperation({
            code: e,
            parameters: t,
            data: r,
            hasDataPhase: !0
        });
    }
    static expectsDataIn(e) {
        return [
            m.GET_DEVICE_INFO,
            m.GET_STORAGE_IDS,
            m.GET_STORAGE_INFO,
            m.GET_NUM_OBJECTS,
            m.GET_OBJECT_HANDLES,
            m.GET_OBJECT_INFO,
            m.GET_OBJECT,
            m.GET_DEVICE_PROP_DESC,
            m.GET_DEVICE_PROP_VALUE,
            I.SDIO_GET_EXT_DEVICE_INFO,
            I.GET_ALL_EXT_DEVICE_PROP_INFO,
            I.SDIO_GET_OSD_IMAGE
        ].includes(e);
    }
};
var y = ((u)=>(u.APERTURE = "aperture", u.SHUTTER_SPEED = "shutterSpeed", u.ISO = "iso", u.EXPOSURE_COMPENSATION = "exposureCompensation", u.EXPOSURE_MODE = "exposureMode", u.EXPOSURE_METERING_MODE = "exposureMeteringMode", u.FOCUS_MODE = "focusMode", u.FOCUS_AREA = "focusArea", u.FOCUS_DISTANCE = "focusDistance", u.AF_MODE = "afMode", u.AF_AREA_MODE = "afAreaMode", u.IMAGE_QUALITY = "imageQuality", u.IMAGE_SIZE = "imageSize", u.IMAGE_FORMAT = "imageFormat", u.WHITE_BALANCE = "whiteBalance", u.COLOR_SPACE = "colorSpace", u.CAPTURE_MODE = "captureMode", u.DRIVE_MODE = "driveMode", u.BURST_NUMBER = "burstNumber", u.BRACKETING_MODE = "bracketingMode", u.FLASH_MODE = "flashMode", u.FLASH_COMPENSATION = "flashCompensation", u.FLASH_SYNC_MODE = "flashSyncMode", u.BATTERY_LEVEL = "batteryLevel", u.DEVICE_NAME = "deviceName", u.SERIAL_NUMBER = "serialNumber", u.FIRMWARE_VERSION = "firmwareVersion", u.DATE_TIME = "dateTime", u.VIDEO_QUALITY = "videoQuality", u.VIDEO_FRAMERATE = "videoFramerate", u.AUDIO_RECORDING = "audioRecording", u.CUSTOM_FUNCTION = "customFunction", u.COPYRIGHT_INFO = "copyrightInfo", u.ARTIST = "artist", u))(y || {}), ee = ((a)=>(a.STRING = "string", a.NUMBER = "number", a.BOOLEAN = "boolean", a.DATE = "date", a.ARRAY = "array", a.FRACTION = "fraction", a.ENUM = "enum", a))(ee || {}), te = ((p)=>(p.SECONDS = "seconds", p.FRACTION = "fraction", p.F_STOP = "fStop", p.ISO_VALUE = "iso", p.PERCENTAGE = "percentage", p.EV = "ev", p.METERS = "meters", p.KELVIN = "kelvin", p.FRAMES_PER_SECOND = "fps", p))(te || {});
var U = class {
    genericToVendor = new Map([
        [
            "batteryLevel",
            T.BATTERY_LEVEL
        ],
        [
            "whiteBalance",
            T.WHITE_BALANCE
        ],
        [
            "aperture",
            T.F_NUMBER
        ],
        [
            "focusMode",
            T.FOCUS_MODE
        ],
        [
            "exposureMeteringMode",
            T.EXPOSURE_METERING_MODE
        ],
        [
            "flashMode",
            T.FLASH_MODE
        ],
        [
            "exposureMode",
            T.EXPOSURE_PROGRAM_MODE
        ],
        [
            "imageSize",
            T.IMAGE_SIZE
        ],
        [
            "dateTime",
            T.DATE_TIME
        ]
    ]);
    vendorToGeneric = new Map;
    constructor(){
        this.genericToVendor.forEach((e, t)=>{
            this.vendorToGeneric.set(e, t);
        });
    }
    mapToVendor(e) {
        let t = this.genericToVendor.get(e);
        if (t === void 0) throw new Error(`Property ${e} not supported by generic mapper`);
        return t;
    }
    mapFromVendor(e) {
        return this.vendorToGeneric.get(e) || null;
    }
    convertValue(e, t) {
        switch(e){
            case "aperture":
                if (typeof t == "string" && t.startsWith("f/")) {
                    let r = parseFloat(t.substring(2));
                    return Math.round(r * 100);
                }
                return t;
            case "whiteBalance":
                return typeof t == "string" ? ({
                    auto: 2,
                    daylight: 4,
                    fluorescent: 5,
                    incandescent: 6,
                    flash: 7,
                    cloudy: 32784,
                    shade: 32785
                })[t.toLowerCase()] || 2 : t;
            default:
                return t;
        }
    }
    parseValue(e, t) {
        switch(e){
            case "aperture":
                return typeof t == "number" ? `f/${(t / 100).toFixed(1)}` : String(t);
            case "batteryLevel":
                return typeof t == "number" ? t : 0;
            case "whiteBalance":
                return typeof t == "number" ? ({
                    2: "auto",
                    4: "daylight",
                    5: "fluorescent",
                    6: "incandescent",
                    7: "flash",
                    32784: "cloudy",
                    32785: "shade"
                })[t] || "auto" : String(t);
            default:
                if (t == null) return "";
                if (typeof t == "object" && t instanceof Uint8Array) {
                    let r = new TextDecoder;
                    try {
                        return r.decode(t);
                    } catch  {
                        return String(t);
                    }
                }
                return t;
        }
    }
    isSupported(e) {
        return this.genericToVendor.has(e);
    }
    getSupportedProperties() {
        return Array.from(this.genericToVendor.keys());
    }
};
var L = ((c)=>(c.JPEG = "jpeg", c.RAW = "raw", c.TIFF = "tiff", c.BMP = "bmp", c.PNG = "png", c.HEIF = "heif", c.DNG = "dng", c.ARW = "arw", c.CR2 = "cr2", c.NEF = "nef", c))(L || {});
var A = class {
    constructor(e, t){
        this.protocol = e;
        this.propertyMapper = t;
    }
    sessionId = 1;
    connected = !1;
    liveViewActive = !1;
    async connect() {
        await this.protocol.openSession(this.sessionId), this.connected = !0;
    }
    async disconnect() {
        this.liveViewActive && await this.disableLiveView(), await this.protocol.closeSession(), this.connected = !1;
    }
    isConnected() {
        return this.connected;
    }
    async captureImage() {
        let e = await this.protocol.sendOperation({
            code: m.INITIATE_CAPTURE,
            parameters: [
                0,
                0
            ],
            hasDataPhase: !1
        });
        if (e.code !== l.OK) throw new Error(`Capture failed: 0x${e.code.toString(16)}`);
    }
    async getDeviceProperty(e) {
        let t = this.propertyMapper.mapToVendor(e), r = await this.protocol.sendOperation({
            code: m.GET_DEVICE_PROP_VALUE,
            parameters: [
                t
            ]
        });
        if (r.code !== l.OK) throw new Error(`Failed to get property ${e}: 0x${r.code.toString(16)}`);
        if (!r.data) throw new Error(`No data received for property ${e}`);
        return this.propertyMapper.parseValue(e, r.data);
    }
    async setDeviceProperty(e, t) {
        let r = this.propertyMapper.mapToVendor(e), n = this.propertyMapper.convertValue(e, t), o = this.encodePropertyValue(n), i = await this.protocol.sendOperation({
            code: m.SET_DEVICE_PROP_VALUE,
            parameters: [
                r
            ],
            hasDataPhase: !0,
            data: o
        });
        if (i.code !== l.OK) throw new Error(`Failed to set property ${e}: 0x${i.code.toString(16)}`);
    }
    async getPropertyDescriptor(e) {
        let t = this.propertyMapper.mapToVendor(e), r = await this.protocol.sendOperation({
            code: m.GET_DEVICE_PROP_DESC,
            parameters: [
                t
            ]
        });
        if (r.code !== l.OK) throw new Error(`Failed to get property descriptor: 0x${r.code.toString(16)}`);
        return this.parsePropertyDescriptor(e, r.data);
    }
    async enableLiveView() {
        this.liveViewActive = !0;
    }
    async disableLiveView() {
        this.liveViewActive = !1;
    }
    async getLiveViewFrame() {
        throw this.liveViewActive ? new Error("Live view not implemented for generic camera") : new Error("Live view is not active");
    }
    isLiveViewActive() {
        return this.liveViewActive;
    }
    async listImages() {
        let e = await this.protocol.sendOperation({
            code: m.GET_OBJECT_HANDLES,
            parameters: [
                4294967295,
                0,
                0
            ]
        });
        if (e.code !== l.OK) throw new Error(`Failed to list images: 0x${e.code.toString(16)}`);
        let t = this.parseHandles(e.data), r = [];
        for (let n of t){
            let o = await this.getObjectInfo(n);
            o && r.push(o);
        }
        return r;
    }
    async downloadImage(e) {
        let t = await this.protocol.sendOperation({
            code: m.GET_OBJECT,
            parameters: [
                e
            ]
        });
        if (t.code !== l.OK) throw new Error(`Failed to download image: 0x${t.code.toString(16)}`);
        return {
            data: t.data.length > 12 ? t.data.slice(12) : t.data,
            format: "jpeg",
            width: 0,
            height: 0,
            handle: e
        };
    }
    async deleteImage(e) {
        let t = await this.protocol.sendOperation({
            code: m.DELETE_OBJECT,
            parameters: [
                e,
                0
            ],
            hasDataPhase: !1
        });
        if (t.code !== l.OK) throw new Error(`Failed to delete image: 0x${t.code.toString(16)}`);
    }
    async getCameraInfo() {
        let e = await this.protocol.sendOperation({
            code: m.GET_DEVICE_INFO,
            parameters: []
        });
        if (e.code !== l.OK) throw new Error(`Failed to get device info: 0x${e.code.toString(16)}`);
        return this.parseDeviceInfo(e.data);
    }
    async getStorageInfo() {
        let e = await this.protocol.sendOperation({
            code: m.GET_STORAGE_IDS,
            parameters: []
        });
        if (e.code !== l.OK) throw new Error(`Failed to get storage IDs: 0x${e.code.toString(16)}`);
        let t = this.parseStorageIds(e.data), r = [];
        for (let n of t){
            let o = await this.getStorageInfoById(n);
            o && r.push(o);
        }
        return r;
    }
    encodePropertyValue(e) {
        if (typeof e == "number") {
            let t = new Uint8Array(4);
            return new DataView(t.buffer).setUint32(0, e, !0), t;
        } else {
            if (e instanceof Uint8Array) return e;
            throw new Error(`Cannot encode property value of type ${typeof e}`);
        }
    }
    parsePropertyDescriptor(e, t) {
        let r = new DataView(t.buffer, t.byteOffset), n = 0;
        r.getUint16(n, !0), n += 2;
        let o = r.getUint16(n, !0);
        n += 2;
        let i = r.getUint8(n);
        return n += 1, {
            property: e,
            dataType: o,
            getSet: i,
            factoryDefault: "",
            currentValue: "",
            formFlag: 0
        };
    }
    parseHandles(e) {
        let t = new DataView(e.buffer, e.byteOffset), r = t.getUint32(0, !0), n = [];
        for(let o = 0; o < r; o++)n.push(t.getUint32(4 + o * 4, !0));
        return n;
    }
    async getObjectInfo(e) {
        try {
            let t = await this.protocol.sendOperation({
                code: m.GET_OBJECT_INFO,
                parameters: [
                    e
                ]
            });
            if (t.code !== l.OK) return null;
            let r = new DataView(t.data.buffer, t.data.byteOffset), n = 0, o = r.getUint32(n, !0);
            n += 4;
            let i = r.getUint16(n, !0);
            n += 2, r.getUint16(n, !0), n += 2;
            let a = r.getUint32(n, !0);
            return n += 4, {
                handle: e,
                storageId: o,
                objectFormat: i,
                protectionStatus: 0,
                objectCompressedSize: a,
                thumbFormat: 0,
                thumbCompressedSize: 0,
                thumbPixWidth: 0,
                thumbPixHeight: 0,
                imagePixWidth: 0,
                imagePixHeight: 0,
                imageBitDepth: 0,
                parentObject: 0,
                associationType: 0,
                associationDescription: 0,
                sequenceNumber: 0,
                filename: `IMG_${e}.jpg`,
                captureDate: new Date,
                modificationDate: new Date
            };
        } catch  {
            return null;
        }
    }
    parseDeviceInfo(e) {
        return {
            manufacturer: "Generic",
            model: "PTP Camera",
            version: "1.0",
            serialNumber: "000000",
            operationsSupported: [],
            eventsSupported: [],
            devicePropertiesSupported: [],
            captureFormats: [],
            imageFormats: []
        };
    }
    parseStorageIds(e) {
        let t = new DataView(e.buffer, e.byteOffset), r = t.getUint32(0, !0), n = [];
        for(let o = 0; o < r; o++)n.push(t.getUint32(4 + o * 4, !0));
        return n;
    }
    async getStorageInfoById(e) {
        try {
            let t = await this.protocol.sendOperation({
                code: m.GET_STORAGE_INFO,
                parameters: [
                    e
                ]
            });
            if (t.code !== l.OK) return null;
            let r = new DataView(t.data.buffer, t.data.byteOffset), n = 0, o = r.getUint16(n, !0);
            n += 2;
            let i = r.getUint16(n, !0);
            n += 2;
            let a = r.getUint16(n, !0);
            n += 2;
            let f = r.getBigUint64(n, !0);
            n += 8;
            let p = r.getBigUint64(n, !0);
            n += 8;
            let c = r.getUint32(n, !0);
            return n += 4, {
                storageId: e,
                storageType: o,
                filesystemType: i,
                accessCapability: a,
                maxCapacity: f,
                freeSpaceInBytes: p,
                freeSpaceInImages: c,
                storageDescription: "",
                volumeLabel: ""
            };
        } catch  {
            return null;
        }
    }
};
var M = class {
    genericToVendor = new Map([
        [
            "aperture",
            d.F_NUMBER
        ],
        [
            "shutterSpeed",
            d.SHUTTER_SPEED
        ],
        [
            "iso",
            d.ISO_SENSITIVITY
        ],
        [
            "batteryLevel",
            d.BATTERY_LEVEL
        ],
        [
            "whiteBalance",
            d.WHITE_BALANCE
        ],
        [
            "focusMode",
            d.FOCUS_MODE
        ],
        [
            "exposureMeteringMode",
            d.EXPOSURE_METERING_MODE
        ],
        [
            "flashMode",
            d.FLASH_MODE
        ],
        [
            "exposureMode",
            d.EXPOSURE_PROGRAM_MODE
        ],
        [
            "imageSize",
            d.IMAGE_SIZE
        ],
        [
            "dateTime",
            d.DATE_TIME
        ]
    ]);
    vendorToGeneric = new Map([
        [
            d.F_NUMBER,
            "aperture"
        ],
        [
            d.SHUTTER_SPEED,
            "shutterSpeed"
        ],
        [
            d.ISO_SENSITIVITY,
            "iso"
        ],
        [
            d.ISO_SENSITIVITY_ALT1,
            "iso"
        ],
        [
            d.ISO_SENSITIVITY_ALT2,
            "iso"
        ],
        [
            d.ISO_SENSITIVITY_ALT3,
            "iso"
        ]
    ]);
    mapToVendor(e) {
        let t = this.genericToVendor.get(e);
        if (t === void 0) throw new Error(`Property ${e} not supported by Sony`);
        return t;
    }
    mapFromVendor(e) {
        return this.vendorToGeneric.get(e) || null;
    }
    convertValue(e, t) {
        switch(e){
            case "shutterSpeed":
                return this.parseShutterSpeed(String(t));
            case "aperture":
                return this.parseAperture(String(t));
            case "iso":
                return this.parseISO(t);
            default:
                return t;
        }
    }
    parseValue(e, t) {
        switch(e){
            case "shutterSpeed":
                return t instanceof Uint8Array ? this.formatShutterSpeedFromBytes(t) : Z(Number(t));
            case "aperture":
                return typeof t == "number" ? q(t) : String(t);
            case "iso":
                return typeof t == "number" ? Q(t) : String(t);
            default:
                return t ?? "";
        }
    }
    isSupported(e) {
        return this.genericToVendor.has(e);
    }
    getSupportedProperties() {
        return Array.from(this.genericToVendor.keys());
    }
    parseShutterSpeed(e) {
        let t = new Uint8Array(8), r = new DataView(t.buffer);
        if (e === "BULB") return r.setUint32(0, 0, !0), r.setUint32(4, 0, !0), t;
        if (e.startsWith("1/")) {
            let n = parseInt(e.substring(2));
            r.setUint32(0, 1, !0), r.setUint32(4, n, !0);
        } else {
            let n = parseFloat(e.replace('"', ""));
            r.setUint32(0, n * 1e4, !0), r.setUint32(4, 1e4, !0);
        }
        return t;
    }
    parseAperture(e) {
        let t = new Uint8Array(2), r = new DataView(t.buffer);
        if (e.startsWith("f/")) {
            let n = parseFloat(e.substring(2));
            r.setUint16(0, Math.round(n * 100), !0);
        }
        return t;
    }
    parseISO(e) {
        if (typeof e == "string") {
            let t = e.toLowerCase();
            if (t === "auto" || t === "iso auto") return 16777215;
            let r = e.match(/\d+/);
            if (r) return parseInt(r[0]);
        }
        return Number(e);
    }
    formatShutterSpeedFromBytes(e) {
        if (e.length >= 8) {
            let t = new DataView(e.buffer, e.byteOffset), r = t.getUint32(0, !0), n = t.getUint32(4, !0);
            if (r === 0 && n === 0) return "BULB";
            if (r === 1 && n > 1) return `1/${n}`;
            if (n !== 0) {
                let o = r / n;
                return o >= 1 ? `${o}"` : `1/${Math.round(1 / o)}`;
            }
        }
        return "Unknown";
    }
};
var w = class {
    deviceInfo = null;
    async authenticate(e) {
        console.log("Sony Auth: Starting Phase 1 - Initial handshake"), await this.sdioConnect(e, C.INITIAL_HANDSHAKE), console.log("Sony Auth: Phase 1 complete"), console.log("Sony Auth: Starting Phase 2 - Capability exchange"), await this.sdioConnect(e, C.CAPABILITY_EXCHANGE), console.log("Sony Auth: Phase 2 complete"), console.log("Sony Auth: Getting extended device info"), await this.getExtDeviceInfo(e), console.log("Sony Auth: Extended device info retrieved"), console.log("Sony Auth: Starting Phase 3 - Final authentication"), await this.sdioConnect(e, C.FINAL_AUTHENTICATION), console.log("Sony Auth: Phase 3 complete - Authentication successful!");
    }
    async sdioConnect(e, t) {
        console.log(`Sony Auth: Sending SDIO_CONNECT for phase ${t}`);
        let r = await e.sendOperation({
            code: I.SDIO_CONNECT,
            parameters: [
                t,
                0,
                0
            ],
            hasDataPhase: !0
        });
        if (console.log(`Sony Auth: SDIO_CONNECT response: 0x${r.code.toString(16)}`), r.code !== l.OK) throw new Error(`SDIO Connect Phase ${t} failed: 0x${r.code.toString(16)}`);
    }
    async getExtDeviceInfo(e) {
        let t = await e.sendOperation({
            code: I.SDIO_GET_EXT_DEVICE_INFO,
            parameters: [
                E.PROTOCOL_VERSION,
                E.DEVICE_PROPERTY_OPTION
            ],
            hasDataPhase: !0
        });
        if (t.code !== l.OK) throw new Error(`Get extended device info failed: 0x${t.code.toString(16)}`);
        if (t.data && t.data.length > 0) {
            let n = new DataView(t.data.buffer, t.data.byteOffset).getUint16(0, !0);
            this.deviceInfo = {
                version: n,
                raw: t.data
            };
        }
    }
    getDeviceInfo() {
        return this.deviceInfo;
    }
};
var z = ((n)=>(n.JPEG = "jpeg", n.YUV = "yuv", n.RGB = "rgb", n.RAW = "raw", n))(z || {}), re = ((n)=>(n.IDLE = "idle", n.FOCUSING = "focusing", n.FOCUSED = "focused", n.FAILED = "failed", n))(re || {});
var h = {
    INT8: 1,
    UINT8: 2,
    INT16: 3,
    UINT16: 4,
    INT32: 5,
    UINT32: 6,
    INT64: 7,
    UINT64: 8,
    INT128: 10,
    UINT128: 11,
    STRING: 65535
};
function ne(s, e, t) {
    switch(t){
        case h.INT8:
            return {
                value: s.getInt8(e),
                size: 1
            };
        case h.UINT8:
            return {
                value: s.getUint8(e),
                size: 1
            };
        case h.INT16:
            return {
                value: s.getInt16(e, !0),
                size: 2
            };
        case h.UINT16:
            return {
                value: s.getUint16(e, !0),
                size: 2
            };
        case h.INT32:
            return {
                value: s.getInt32(e, !0),
                size: 4
            };
        case h.UINT32:
            return {
                value: s.getUint32(e, !0),
                size: 4
            };
        case h.INT64:
            return {
                value: Number(s.getBigInt64(e, !0)),
                size: 8
            };
        case h.UINT64:
            return {
                value: Number(s.getBigUint64(e, !0)),
                size: 8
            };
        case h.INT128:
        case h.UINT128:
            return {
                value: BigInt(0),
                size: 16
            };
        case h.STRING:
            {
                let r = s.getUint8(e);
                e += 1;
                let n = "";
                for(let o = 0; o < r; o++){
                    let i = s.getUint16(e, !0);
                    if (i === 0) break;
                    n += String.fromCharCode(i), e += 2;
                }
                return {
                    value: n,
                    size: 1 + r * 2
                };
            }
        default:
            if ((t & 16384) === 16384) {
                let r = s.getUint32(e, !0);
                e += 4;
                let n = t & 16383, o = [], i = 4;
                for(let a = 0; a < r; a++){
                    let f = ne(s, e, n);
                    o.push(f.value), e += f.size, i += f.size;
                }
                return {
                    value: o,
                    size: i
                };
            }
            return {
                value: null,
                size: 4
            };
    }
}
var V = class extends A {
    sonyAuthenticator;
    lastLiveViewTime = 0;
    cachedProperties = null;
    propertiesLastFetched = 0;
    PROPERTIES_CACHE_TTL = 5e3;
    constructor(e, t){
        super(e, new M), this.sonyAuthenticator = t || new w;
    }
    async connect() {
        try {
            await this.protocol.closeSession();
        } catch  {}
        await this.protocol.openSession(this.sessionId), await this.sonyAuthenticator.authenticate(this.protocol), this.connected = !0;
    }
    async captureImage() {
        await this.configureStillShooting(), await this.sleep(500), await this.executeShootingSequence();
    }
    async enableLiveView() {
        let e = new Uint8Array(2);
        new DataView(e.buffer).setUint16(0, E.LIVE_VIEW_ENABLE, !0), await this.protocol.sendOperation({
            code: I.CONTROL_DEVICE_PROPERTY,
            parameters: [
                d.LIVE_VIEW_CONTROL
            ],
            hasDataPhase: !0,
            data: e
        }), await this.sleep(1e3), this.liveViewActive = !0;
    }
    async disableLiveView() {
        let e = new Uint8Array(2);
        new DataView(e.buffer).setUint16(0, E.LIVE_VIEW_DISABLE, !0), await this.protocol.sendOperation({
            code: I.CONTROL_DEVICE_PROPERTY,
            parameters: [
                d.LIVE_VIEW_CONTROL
            ],
            hasDataPhase: !0,
            data: e
        }), this.liveViewActive = !1;
    }
    async getLiveViewFrame() {
        if (!this.liveViewActive) throw new Error("Live view is not active");
        let t = Date.now() - this.lastLiveViewTime;
        if (t < 33) {
            let O = 33 - t;
            await this.sleep(O);
        }
        this.lastLiveViewTime = Date.now();
        let r = await this.protocol.sendOperation({
            code: m.GET_OBJECT_INFO,
            parameters: [
                E.LIVE_VIEW_IMAGE_HANDLE
            ]
        }), n = 1920, o = 1080;
        if (r.data && r.data.length > 12) {
            let N = new DataView(r.data.buffer, r.data.byteOffset + 12).getUint32(8, !0);
            console.log(`Image size: ${N} bytes`);
        }
        let i = null, a = 0, f = 3;
        for(; !i && a < f;){
            let O = await this.protocol.sendOperation({
                code: m.GET_OBJECT,
                parameters: [
                    E.LIVE_VIEW_IMAGE_HANDLE
                ],
                maxDataLength: 5242880
            });
            if (O.code === E.ACCESS_DENIED) {
                a++, await this.sleep(50);
                continue;
            }
            if (O.code === l.OK && O.data) {
                i = O.data;
                break;
            }
            a++;
        }
        if (!i) throw new Error("Failed to get live view image after retries");
        let p = i;
        console.log(`Live view dataset length: ${p.length}`), p.length > 20 && console.log(`First 20 bytes of dataset: ${Array.from(p.slice(0, 20)).map((O)=>`0x${O.toString(16).padStart(2, "0")}`).join(" ")}`);
        let c = this.parseLiveViewDataset(p);
        if (!c) throw new Error("Failed to parse LiveView Dataset");
        return c.jpeg.length === 0 ? (console.log("Live view frame is empty (camera may not be ready)"), {
            data: new Uint8Array(0),
            width: n || 1920,
            height: o || 1080,
            format: "jpeg",
            timestamp: Date.now()
        }) : {
            data: c.jpeg,
            width: n || c.width || 1920,
            height: o || c.height || 1080,
            format: "jpeg",
            timestamp: Date.now()
        };
    }
    async setOSDMode(e) {
        try {
            let t = e ? 1 : 0, r = new Uint8Array(1);
            return r[0] = t, await this.setPropertyValue(d.OSD_IMAGE_MODE, r), !0;
        } catch (t) {
            return console.log(`Failed to set OSD mode: ${String(t)}`), !1;
        }
    }
    async getOSDImage() {
        await this.setOSDMode(!0), await this.sleep(100);
        let e = await this.protocol.sendOperation({
            code: I.SDIO_GET_OSD_IMAGE,
            parameters: [],
            hasDataPhase: !0,
            maxDataLength: 512 * 1024
        });
        if (e.code !== l.OK) throw new Error(`GetOSDImage failed with code 0x${e.code.toString(16)}`);
        if (!e.data || e.data.length === 0) throw new Error("No OSD image data received");
        let t = this.parseOSDDataset(e.data);
        if (!t) throw new Error("Failed to extract PNG from OSD data");
        return {
            data: t,
            format: "png",
            width: 0,
            height: 0
        };
    }
    async getCameraSettings() {
        if (await this.refreshPropertiesIfNeeded(), !this.cachedProperties) throw new Error("Failed to get camera settings");
        let e = this.extractPropertyValue(d.F_NUMBER), t = this.extractPropertyValue(d.SHUTTER_SPEED), r = this.extractPropertyValue(d.ISO_SENSITIVITY);
        return {
            aperture: e ? this.formatAperture(e) : "Unknown",
            shutterSpeed: t ? this.formatShutterSpeed(t) : "Unknown",
            iso: r ? this.formatISO(r) : "Unknown"
        };
    }
    async getDeviceProperty(e) {
        if (await this.refreshPropertiesIfNeeded(), !this.cachedProperties) throw new Error("Failed to get device properties");
        let t = this.propertyMapper.mapToVendor(e);
        console.log(`Looking for property ${e} with vendor code 0x${t.toString(16)}`);
        let r = this.extractPropertyValue(t);
        if (r === void 0) switch(console.log(`Warning: Property ${e} (0x${t.toString(16)}) not found, using default`), e){
            case "shutterSpeed":
                return "1/60";
            case "aperture":
                return "f/2.8";
            case "iso":
                return "AUTO";
            default:
                return "N/A";
        }
        return this.propertyMapper.parseValue(e, r);
    }
    async getPhoto() {
        await this.sleep(1e3);
        let e = await this.protocol.sendOperation({
            code: m.GET_OBJECT_INFO,
            parameters: [
                E.RECENT_IMAGE_HANDLE
            ]
        }), t = "captured_image.jpg", r = 0, n = 0;
        if (e.data && e.data.length > 12) {
            let a = new DataView(e.data.buffer, e.data.byteOffset + 12);
            n = a.getUint16(4, !0), r = a.getUint32(8, !0), console.log(`File size: ${r} bytes`);
            let f = ".jpg";
            n === 45313 ? f = ".arw" : n === 14338 && (f = ".tiff"), t = `IMG_${new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5)}${f}`;
        }
        let o = await this.protocol.sendOperation({
            code: m.GET_OBJECT,
            parameters: [
                E.RECENT_IMAGE_HANDLE
            ],
            maxDataLength: r > 0 ? r + 1024 : 50 * 1024 * 1024
        });
        if (o.code !== l.OK || !o.data) throw new Error("Failed to download image");
        return {
            data: o.data,
            format: n === 45313 ? "raw" : "jpeg",
            width: 0,
            height: 0,
            filename: t
        };
    }
    async setPropertyValue(e, t) {
        let r;
        typeof t == "number" ? (r = new Uint8Array(1), r[0] = t) : r = t, await this.protocol.sendOperation({
            code: I.SET_DEVICE_PROPERTY_VALUE,
            parameters: [
                e
            ],
            data: r,
            hasDataPhase: !0
        });
    }
    async configureStillShooting() {
        await this.setPropertyValue(d.DIAL_MODE, new Uint8Array([
            E.DIAL_MODE_HOST
        ]));
        let e = new Uint8Array(4);
        new DataView(e.buffer).setUint32(0, E.STILL_CAPTURE_MODE, !0), await this.setPropertyValue(d.STILL_CAPTURE_MODE, e);
        let t = new Uint8Array(2);
        new DataView(t.buffer).setUint16(0, E.SAVE_MEDIA_HOST, !0), await this.setPropertyValue(d.SAVE_MEDIA, t);
    }
    async executeShootingSequence() {
        await this.sendControlCommand(d.SHUTTER_BUTTON_CONTROL, E.SHUTTER_HALF_PRESS), await this.sleep(500), await this.sendControlCommand(d.FOCUS_BUTTON_CONTROL, E.FOCUS_HALF_PRESS), await this.sleep(500), await this.sendControlCommand(d.FOCUS_BUTTON_CONTROL, E.FOCUS_RELEASE), await this.sleep(500), await this.sendControlCommand(d.SHUTTER_BUTTON_CONTROL, E.SHUTTER_FULL_PRESS), await this.sleep(500);
    }
    async sendControlCommand(e, t) {
        let r = new Uint8Array(2);
        new DataView(r.buffer).setUint16(0, t, !0), await this.protocol.sendOperation({
            code: I.CONTROL_DEVICE_PROPERTY,
            parameters: [
                e
            ],
            hasDataPhase: !0,
            data: r
        });
    }
    parseLiveViewDataset(e) {
        if (e.length < 16) return null;
        let t = new DataView(e.buffer, e.byteOffset), r = t.getUint32(0, !0), n = t.getUint32(4, !0);
        if (console.log(`LiveView dataset: offset=${r}, size=${n}, dataLength=${e.length}`), n === 0) return {
            jpeg: new Uint8Array(0)
        };
        if (r >= e.length || r + n > e.length) return console.log(`Invalid offsets: offset=${r}, size=${n}, dataLength=${e.length}`), null;
        let o = e.slice(r, r + n);
        return o.length >= 2 && o[0] === 255 && o[1] === 216 && console.log(`Valid JPEG found: ${o.length} bytes`), {
            jpeg: o
        };
    }
    parseOSDDataset(e) {
        if (e.length < 20) return null;
        let t = new DataView(e.buffer, e.byteOffset), r = t.getUint32(0, !0), n = t.getUint32(4, !0);
        return r >= e.length || r + n > e.length ? null : e.slice(r, r + n);
    }
    sleep(e) {
        return new Promise((t)=>setTimeout(t, e));
    }
    async refreshPropertiesIfNeeded() {
        let e = Date.now();
        (!this.cachedProperties || e - this.propertiesLastFetched > this.PROPERTIES_CACHE_TTL) && (await this.getAllExtDevicePropInfo(), this.propertiesLastFetched = e);
    }
    async getAllExtDevicePropInfo() {
        let e = await this.protocol.sendOperation({
            code: I.GET_ALL_EXT_DEVICE_PROP_INFO,
            parameters: [
                0,
                1
            ],
            hasDataPhase: !0,
            maxDataLength: 10485760
        });
        if (e.code !== l.OK) throw new Error(`Failed to get extended device properties: 0x${e.code.toString(16)}`);
        if (!e.data || e.data.length < 12) throw new Error("No property data received");
        console.log(`Received ${e.data.length} bytes for GET_ALL_EXT_DEVICE_PROP_INFO`), console.log(`First 20 bytes: ${Array.from(e.data.slice(0, 20)).map((r)=>`0x${r.toString(16).padStart(2, "0")}`).join(" ")}`), this.cachedProperties = this.parseAllExtDevicePropInfo(e.data), console.log(`Parsed ${this.cachedProperties.size} properties out of 370`);
        let t = [
            53790,
            53773,
            20487
        ];
        for (let r of t)this.cachedProperties.has(r) ? console.log(`  Found property 0x${r.toString(16)}: ${this.cachedProperties.get(r).currentValue}`) : console.log(`  Missing property 0x${r.toString(16)}`);
        if (this.cachedProperties.size < 100) {
            let r = Array.from(this.cachedProperties.keys()).map((n)=>`0x${n.toString(16)}`).join(", ");
            console.log(`All property codes found: ${r}`);
        }
    }
    parseAllExtDevicePropInfo(e) {
        let t = new Map, r = e.slice(12);
        new DataView(r.buffer, r.byteOffset).getBigUint64(0, !0);
        let o = 8, i = 0, a = 0;
        for(; o < r.length - 6 && i + a < 1e3;)try {
            if (o + 8 > r.length) break;
            let f = this.parseSDIExtDevicePropInfo(r, o);
            f ? (t.set(f.propertyCode, f), o = f.nextOffset, i++) : (o += 2, a++);
        } catch  {
            o += 2, a++;
        }
        return t;
    }
    parseSDIExtDevicePropInfo(e, t) {
        try {
            if (t + 8 > e.length) return null;
            let r = new DataView(e.buffer, e.byteOffset + t), n = 0, o = r.getUint16(n, !0);
            if (n += 2, !(o >= E.PTP_PROP_MIN && o <= E.PTP_PROP_MAX || o >= E.VENDOR_PROP_MIN && o <= E.VENDOR_PROP_MAX)) return null;
            let i = r.getUint16(n, !0);
            if (n += 2, !(i >= E.DATA_TYPE_MIN && i <= E.DATA_TYPE_MAX || i >= E.DATA_TYPE_ARRAY_MIN && i <= E.DATA_TYPE_ARRAY_MAX || i === E.DATA_TYPE_STRING)) return null;
            let a = r.getUint8(n);
            n += 1;
            let f = r.getUint8(n);
            n += 1;
            let p = this.getReservedSize(i);
            n += p;
            let { value: c, size: O } = this.readPropertyValue(r, n, i);
            n += O;
            let N = r.getUint8(n);
            n += 1;
            let P = {
                propertyCode: o,
                dataType: i,
                getSet: a,
                isEnabled: f,
                currentValue: c,
                formFlag: N,
                nextOffset: t + n
            };
            if (N === 2) {
                let le = r.getUint16(n, !0);
                n += 2, P.enumValuesSet = [];
                for(let b = 0; b < le; b++){
                    let { value: k, size: Y } = this.readPropertyValue(r, n, i);
                    P.enumValuesSet.push(k), n += Y;
                }
                let Ee = r.getUint16(n, !0);
                n += 2, P.enumValuesGetSet = [];
                for(let b = 0; b < Ee; b++){
                    let { value: k, size: Y } = this.readPropertyValue(r, n, i);
                    P.enumValuesGetSet.push(k), n += Y;
                }
                P.nextOffset = t + n;
            }
            return P;
        } catch  {
            return null;
        }
    }
    readPropertyValue(e, t, r) {
        return ne(e, t, r);
    }
    getReservedSize(e) {
        let t = this.getDataTypeSize(e);
        return t === 0 && (e & 16384) === 16384 ? 4 : t;
    }
    getDataTypeSize(e) {
        switch(e){
            case h.INT8:
            case h.UINT8:
                return 1;
            case h.INT16:
            case h.UINT16:
                return 2;
            case h.INT32:
            case h.UINT32:
                return 4;
            case h.INT64:
            case h.UINT64:
                return 8;
            case h.INT128:
            case h.UINT128:
                return 16;
            case h.STRING:
                return 0;
            default:
                return (e & 16384) === 16384 ? 0 : 4;
        }
    }
    extractPropertyValue(e) {
        return this.cachedProperties ? this.cachedProperties.get(e)?.currentValue : void 0;
    }
    formatAperture(e) {
        return typeof e == "number" ? `f/${(e / 100).toFixed(1)}` : String(e);
    }
    formatShutterSpeed(e) {
        if (typeof e == "number") {
            if (e === 0) return "BULB";
            if (e === 4294967295) return "N/A";
            let t = e >> 16 & 65535, r = e & 65535;
            if (r === 10) return `${t / 10}"`;
            if (t === 1) return `1/${r}`;
            if (r !== 0) return `${t}/${r}`;
        }
        return "Unknown";
    }
    formatISO(e) {
        if (typeof e == "number") {
            if (e === 16777215) return "AUTO";
            if (e === 33554431) return "Multi Frame NR ISO AUTO";
            if (e === 50331647) return "Multi Frame NR High ISO AUTO";
            if (e === 4294967295) return "N/A";
            let t = e >> 24 & 255, r = "";
            t === 1 ? r = "Multi Frame NR " : t === 2 && (r = "Multi Frame NR High ");
            let n = e & 16777215;
            if (n >= 10 && n <= 1e6) return `${r}ISO ${n}`;
        }
        return "Unknown";
    }
};
var S = class {
    createSonyCamera(e) {
        let t = this.createMessageBuilder(), r = this.createProtocol(e, t), n = new w;
        return new V(r, n);
    }
    createCanonCamera(e) {
        throw this.createMessageBuilder(), this.createProtocol(e, this.createMessageBuilder()), new Error("Canon camera not implemented in old architecture");
    }
    createNikonCamera(e) {
        throw this.createMessageBuilder(), this.createProtocol(e, this.createMessageBuilder()), new Error("Nikon camera not implemented in old architecture");
    }
    createGenericCamera(e) {
        let t = this.createMessageBuilder(), r = this.createProtocol(e, t), n = this.createGenericPropertyMapper();
        return new A(r, n);
    }
    create(e, t) {
        switch(e.toLowerCase()){
            case "sony":
                return this.createSonyCamera(t);
            case "canon":
                return this.createCanonCamera(t);
            case "nikon":
                return this.createNikonCamera(t);
            case "fuji":
            case "fujifilm":
                throw new Error("Fujifilm camera not implemented in old architecture");
            case "panasonic":
                throw new Error("Panasonic camera not implemented in old architecture");
            case "olympus":
                throw new Error("Olympus camera not implemented in old architecture");
            default:
                return this.createGenericCamera(t);
        }
    }
    detectVendor(e, t) {
        switch(e){
            case 1356:
                return "sony";
            case 1193:
                return "canon";
            case 1200:
                return "nikon";
            case 1227:
                return "fujifilm";
            case 9988:
                return "panasonic";
            case 1972:
                return "olympus";
            default:
                return "generic";
        }
    }
    createMessageBuilder() {
        return new v;
    }
    createProtocol(e, t) {
        return new R(e, t);
    }
    createGenericPropertyMapper() {
        return new U;
    }
};
var _ = class {
    async findDevices(e) {
        let t = await navigator.usb.getDevices();
        return console.log("[WebUSBDeviceFinder] Got devices from getDevices():", t), console.log("[WebUSBDeviceFinder] Search criteria:", e), t.filter((r)=>!(e.vendorId !== void 0 && e.vendorId !== 0 && r.vendorId !== e.vendorId || e.productId !== void 0 && e.productId !== 0 && r.productId !== e.productId)).map((r)=>({
                device: r,
                vendorId: r.vendorId,
                productId: r.productId,
                manufacturer: r.manufacturerName || void 0,
                product: r.productName || void 0,
                serialNumber: r.serialNumber || void 0
            }));
    }
    async requestDevice(e) {
        let t = [];
        e.class === 6 ? t.push({
            classCode: 6
        }) : e.vendorId !== void 0 && e.vendorId !== 0 ? (t.push({
            vendorId: e.vendorId
        }), e.productId !== void 0 && e.productId !== 0 && (t[0] = {
            ...t[0],
            productId: e.productId
        })) : t.push({
            classCode: 6
        }), console.log("[WebUSBDeviceFinder] Requesting device with filters:", t);
        let r = await navigator.usb.requestDevice({
            filters: t
        });
        return {
            device: r,
            vendorId: r.vendorId,
            productId: r.productId,
            manufacturer: r.manufacturerName || void 0,
            product: r.productName || void 0,
            serialNumber: r.serialNumber || void 0
        };
    }
    async getAllDevices() {
        return (await navigator.usb.getDevices()).map((t)=>({
                device: t,
                vendorId: t.vendorId,
                productId: t.productId,
                manufacturer: t.manufacturerName || void 0,
                product: t.productName || void 0,
                serialNumber: t.serialNumber || void 0
            }));
    }
};
async function Ie() {
    let s = new _, e = new S;
    try {
        let t = await s.requestDevice({
            class: 6
        }), r = e.detectVendor(t.vendorId);
        return {
            vendor: r.charAt(0).toUpperCase() + r.slice(1),
            model: t.product || "Camera",
            serialNumber: t.serialNumber,
            usb: {
                vendorId: t.vendorId,
                productId: t.productId
            }
        };
    } catch (t) {
        return console.error("Failed to request camera access:", t), null;
    }
}
async function B(s) {
    let e = new _, t = new S, r = {
        vendorId: s?.usb?.vendorId || 0,
        productId: s?.usb?.productId || 0
    }, o = (await e.findDevices(r)).map((i)=>{
        let a = t.detectVendor(i.vendorId);
        return {
            vendor: a.charAt(0).toUpperCase() + a.slice(1),
            model: "Camera",
            serialNumber: i.serialNumber,
            usb: {
                vendorId: i.vendorId,
                productId: i.productId
            }
        };
    });
    if (s?.vendor && (o = o.filter((i)=>i.vendor.toLowerCase() === s.vendor.toLowerCase())), s?.model && (o = o.filter((i)=>i.model.toLowerCase().includes(s.model.toLowerCase()))), s?.serialNumber && (o = o.filter((i)=>i.serialNumber === s.serialNumber)), s?.ip && s.ip.host) {
        let i = {
            vendor: s.vendor || "Unknown",
            model: s.model || "IP Camera",
            serialNumber: s.serialNumber,
            ip: {
                host: s.ip.host,
                port: s.ip.port || 15740
            }
        };
        o.push(i);
    }
    return o;
}
function Te(s, e) {
    let r = -1, n = async ()=>{
        try {
            let i = await B(e);
            i.length !== r && (r = i.length, s(i));
        } catch (i) {
            console.error("Error watching cameras:", i);
        }
    };
    n();
    let o = setInterval(n, 1e3);
    return ()=>clearInterval(o);
}
var F = class {
    events = new Map;
    on(e, t) {
        return this.events.has(e) || this.events.set(e, []), this.events.get(e).push(t), this;
    }
    once(e, t) {
        let r = (...n)=>{
            this.off(e, r), t.apply(this, n);
        };
        return this.on(e, r);
    }
    off(e, t) {
        let r = this.events.get(e);
        if (r) {
            let n = r.indexOf(t);
            n !== -1 && r.splice(n, 1);
        }
        return this;
    }
    removeListener(e, t) {
        return this.off(e, t);
    }
    emit(e, ...t) {
        let r = this.events.get(e);
        return r && r.length > 0 ? (r.forEach((n)=>{
            n.apply(this, t);
        }), !0) : !1;
    }
    removeAllListeners(e) {
        return e ? this.events.delete(e) : this.events.clear(), this;
    }
    listenerCount(e) {
        let t = this.events.get(e);
        return t ? t.length : 0;
    }
    listeners(e) {
        return this.events.get(e) || [];
    }
    setMaxListeners(e) {
        return this;
    }
    getMaxListeners() {
        return Number.POSITIVE_INFINITY;
    }
};
var K = ((r)=>(r.BULK_IN = "bulk_in", r.BULK_OUT = "bulk_out", r.INTERRUPT = "interrupt", r))(K || {});
var G = class {
    constructor(e, t){
        this.deviceFinder = e;
        this.endpointManager = t;
    }
    device = null;
    interface = null;
    endpoints = null;
    connected = !1;
    isWebEnvironment = typeof navigator < "u" && "usb" in navigator;
    deviceInfo = null;
    async connect(e) {
        if (this.connected) throw new Error("Already connected");
        let r = (await this.deviceFinder.findDevices({
            vendorId: e.vendorId,
            productId: e.productId,
            class: 6
        })).find((n)=>e.serialNumber ? n.serialNumber === e.serialNumber : !0);
        if (!r && this.isWebEnvironment && (r = await this.deviceFinder.requestDevice({
            vendorId: e.vendorId,
            productId: e.productId
        })), !r) throw new Error(`Device not found: ${e.vendorId}:${e.productId}`);
        this.device = r.device, this.deviceInfo = {
            vendorId: r.vendorId,
            productId: r.productId
        }, this.isWebEnvironment ? await this.connectWebUSB() : await this.connectNodeUSB(), this.connected = !0;
    }
    async disconnect() {
        if (this.connected) {
            if (this.isWebEnvironment) this.interface && await this.device.releaseInterface(this.interface.interfaceNumber), await this.device.close();
            else {
                await this.endpointManager.releaseEndpoints();
                try {
                    this.device.close();
                } catch  {}
            }
            this.device = null, this.interface = null, this.endpoints = null, this.connected = !1;
        }
    }
    async send(e) {
        if (!this.connected || !this.endpoints) throw new Error("Not connected");
        let t = Buffer.from(e), r = this.isWebEnvironment ? this.endpoints.bulkOut.endpointNumber : this.endpoints.bulkOut.descriptor.bEndpointAddress;
        if (console.log(`USB Transport: Sending ${t.length} bytes to endpoint 0x${r.toString(16)}`), this.isWebEnvironment) {
            let n = await this.device.transferOut(this.endpoints.bulkOut.endpointNumber, t);
            if (n.status !== "ok") throw new Error(`Transfer failed: ${n.status}`);
        } else return new Promise((n, o)=>{
            let i = (a)=>{
                console.log(`USB Transport: Transfer callback, error: ${a}`), a ? this.handleNodeUSBError(a, t, n, o) : n();
            };
            console.log(`USB Transport: Calling transfer with ${t.length} bytes`), this.endpoints.bulkOut.transfer(t, i);
        });
    }
    async receive(e = 8192) {
        if (!this.connected || !this.endpoints) throw new Error("Not connected");
        if (this.isWebEnvironment) {
            let t = await this.device.transferIn(this.endpoints.bulkIn.endpointNumber, e);
            if (t.status !== "ok") throw new Error(`Transfer failed: ${t.status}`);
            return new Uint8Array(t.data.buffer);
        } else return new Promise((t, r)=>{
            let n = (o, i)=>{
                o ? o.errno === 4 || o.errno === -9 || o.message?.includes("STALL") ? (console.log("USB receive stall detected, clearing halt..."), this.endpointManager.clearHalt("bulk_in").then(()=>{
                    console.log("USB receive halt cleared, retrying..."), this.endpoints.bulkIn.transfer(e, (a, f)=>{
                        a ? r(a) : t(new Uint8Array(f));
                    });
                }).catch(()=>{
                    r(o);
                })) : r(o) : t(new Uint8Array(i));
            };
            this.endpoints.bulkIn.transfer(e, n);
        });
    }
    isConnected() {
        return this.connected;
    }
    async reset() {
        if (!this.connected || !this.device) throw new Error("Not connected");
        if (!this.isWebEnvironment) try {
            this.device.reset();
        } catch  {}
    }
    getType() {
        return "usb";
    }
    getDeviceInfo() {
        return this.deviceInfo;
    }
    async connectWebUSB() {
        await this.device.open();
        let e = await this.endpointManager.configureEndpoints(this.device);
        this.endpoints = e;
        let t = this.device.configuration || this.device.configurations[0];
        for (let r of t.interfaces){
            let n = r.alternates[0];
            if (n.interfaceClass === 6 && n.interfaceSubclass === 1) {
                this.interface = r, await this.device.claimInterface(r.interfaceNumber);
                break;
            }
        }
        if (!this.interface) throw new Error("Failed to claim PTP interface");
    }
    async connectNodeUSB() {
        this.device.open();
        let e = await this.endpointManager.configureEndpoints(this.device);
        this.endpoints = e;
    }
    handleNodeUSBError(e, t, r, n) {
        console.log(`USB Transport: Handling error - errno: ${e.errno}, message: ${e.message}`), e.errno === -9 || e.errno === 4 || e.message?.includes("PIPE") || e.message?.includes("STALL") ? (console.log("USB Transport: Clearing halt and retrying..."), this.endpointManager.clearHalt("bulk_out").then(()=>{
            console.log("USB Transport: Halt cleared, retrying transfer..."), this.endpoints.bulkOut.transfer(t, (o)=>{
                o ? (console.log(`USB Transport: Retry failed: ${o}`), n(o)) : (console.log("USB Transport: Retry successful!"), r());
            });
        }).catch((o)=>{
            console.log(`USB Transport: Failed to clear halt: ${o}`), n(e);
        })) : n(e);
    }
};
var H = class {
    configuration = null;
    async configureEndpoints(e) {
        let t = e.configuration || e.configurations[0], r = null;
        for (let i of t.interfaces){
            let a = i.alternates[0];
            if (a.interfaceClass === 6 && a.interfaceSubclass === 1) {
                r = i;
                break;
            }
        }
        if (!r) throw new Error("PTP interface not found");
        let n = {
            bulkIn: null,
            bulkOut: null,
            interrupt: void 0
        }, o = r.alternates[0];
        for (let i of o.endpoints)i.direction === "in" && i.type === "bulk" ? n.bulkIn = i : i.direction === "out" && i.type === "bulk" ? n.bulkOut = i : i.direction === "in" && i.type === "interrupt" && (n.interrupt = i);
        if (!n.bulkIn || !n.bulkOut) throw new Error("Required bulk endpoints not found");
        return this.configuration = n, n;
    }
    async releaseEndpoints() {
        this.configuration = null;
    }
    getConfiguration() {
        return this.configuration;
    }
    async clearHalt(e) {}
};
var $ = class {
    createUSBTransport(e) {
        let t = this.createUSBDeviceFinder(), r = this.createUSBEndpointManager();
        return new G(t, r);
    }
    createIPTransport(e) {
        throw new Error("IP transport not implemented in old architecture");
    }
    create(e, t) {
        switch(e){
            case "usb":
                return this.createUSBTransport(t);
            case "ip":
                return this.createIPTransport(t);
            case "bluetooth":
                throw new Error("Bluetooth transport not implemented in old architecture");
            default:
                throw new Error(`Unknown transport type: ${e}`);
        }
    }
    createUSBDeviceFinder() {
        return new _;
    }
    createUSBEndpointManager() {
        return new H;
    }
};
var D = class {
    data;
    filename;
    size;
    capturedAt;
    constructor(e, t, r){
        this.data = e, this.filename = t, this.size = e instanceof ArrayBuffer ? e.byteLength : e.length, this.capturedAt = r || new Date;
    }
    async save(e) {
        let t = this.toBlob(), r = URL.createObjectURL(t), n = document.createElement("a");
        n.href = r, n.download = e || this.filename, n.click(), URL.revokeObjectURL(r);
    }
    toBlob() {
        let e;
        return this.data instanceof ArrayBuffer ? e = this.data : e = this.data.buffer.slice(this.data.byteOffset, this.data.byteOffset + this.data.byteLength), new Blob([
            e
        ], {
            type: "image/jpeg"
        });
    }
    async toFile() {
        let e;
        return this.data instanceof ArrayBuffer ? e = this.data : e = this.data.buffer.slice(this.data.byteOffset, this.data.byteOffset + this.data.byteLength), new File([
            e
        ], this.filename, {
            type: "image/jpeg",
            lastModified: this.capturedAt.getTime()
        });
    }
    toJSON() {
        return {
            filename: this.filename,
            size: this.size,
            capturedAt: this.capturedAt,
            dataSize: this.size
        };
    }
};
var J = class extends F {
    options;
    cameraImplementation;
    transportFactory;
    cameraFactory;
    _vendor;
    _model;
    _serialNumber;
    constructor(e){
        super(), this.options = e || {}, this.transportFactory = new $, this.cameraFactory = new S;
    }
    async connect() {
        if (!this.options.usb?.productId && !this.options.ip?.host) {
            let e = await B(this.options);
            if (e.length === 0) {
                let r = [];
                this.options.vendor && r.push(`vendor: ${this.options.vendor}`), this.options.model && r.push(`model: ${this.options.model}`), this.options.usb?.vendorId && r.push(`USB vendor: 0x${this.options.usb.vendorId.toString(16)}`);
                let n = r.length > 0 ? ` matching filters: ${r.join(", ")}` : "";
                throw new Error(`No cameras found${n}. Please connect a camera via USB.`);
            }
            let t = e[0];
            t && (this.options = {
                ...this.options,
                ...t
            }, this._vendor = t.vendor, this._model = t.model, this._serialNumber = t.serialNumber);
        }
        await this.establishConnection();
    }
    async establishConnection() {
        if (this.options.ip) throw new Error("IP connections not yet implemented");
        let e = this.transportFactory.create("usb", {
            timeout: this.options.timeout
        });
        await e.connect({
            vendorId: this.options.usb?.vendorId || 0,
            productId: this.options.usb?.productId || 0,
            serialNumber: this.options.serialNumber
        });
        let t = this.options.vendor || this.cameraFactory.detectVendor(this.options.usb?.vendorId || 0, this.options.usb?.productId || 0);
        this.cameraImplementation = this.cameraFactory.create(t, e), await this.cameraImplementation.connect(), this._vendor || (this._vendor = this.options.vendor || t), this._model || (this._model = this.options.model || "Unknown"), this._serialNumber || (this._serialNumber = this.options.serialNumber || "Unknown");
    }
    async disconnect() {
        this.cameraImplementation && (await this.cameraImplementation.disconnect(), this.cameraImplementation = void 0), this.emit("disconnect");
    }
    isConnected() {
        return this.cameraImplementation?.isConnected() || !1;
    }
    get vendor() {
        if (!this._vendor) throw new Error("Camera not connected");
        return this._vendor;
    }
    get model() {
        if (!this._model) throw new Error("Camera not connected");
        return this._model;
    }
    get serialNumber() {
        if (!this._serialNumber) throw new Error("Camera not connected");
        return this._serialNumber;
    }
    async takePhoto() {
        if (!this.cameraImplementation) throw new Error("Camera not connected");
        try {
            await this.cameraImplementation.captureImage();
            let e = await this.cameraImplementation.listImages();
            if (e.length === 0) throw new Error("No images found after capture");
            let t = e[e.length - 1];
            if (!t) throw new Error("No image found after capture");
            let r = await this.cameraImplementation.downloadImage(t.handle), n = r instanceof Buffer ? r : Buffer.from(r), o = new D(n, t.filename || "unknown");
            return this.emit("photo", o), o;
        } catch (e) {
            throw this.emit("error", e), e;
        }
    }
    async getISO() {
        if (!this.cameraImplementation) throw new Error("Camera not connected");
        return await this.cameraImplementation.getDeviceProperty("iso");
    }
    async setISO(e) {
        if (!this.cameraImplementation) throw new Error("Camera not connected");
        await this.cameraImplementation.setDeviceProperty("iso", e);
    }
    async getShutterSpeed() {
        if (!this.cameraImplementation) throw new Error("Camera not connected");
        let e = await this.cameraImplementation.getDeviceProperty("shutterSpeed");
        return this.formatShutterSpeed(e);
    }
    async setShutterSpeed(e) {
        if (!this.cameraImplementation) throw new Error("Camera not connected");
        let t = this.parseShutterSpeed(e);
        await this.cameraImplementation.setDeviceProperty("shutterSpeed", t);
    }
    async getAperture() {
        if (!this.cameraImplementation) throw new Error("Camera not connected");
        let e = await this.cameraImplementation.getDeviceProperty("aperture");
        return this.formatAperture(e);
    }
    async setAperture(e) {
        if (!this.cameraImplementation) throw new Error("Camera not connected");
        let t = this.parseAperture(e);
        await this.cameraImplementation.setDeviceProperty("aperture", t);
    }
    async getExposureMode() {
        if (!this.cameraImplementation) throw new Error("Camera not connected");
        let e = await this.cameraImplementation.getDeviceProperty("exposureMode");
        return this.mapExposureMode(e);
    }
    async setExposureMode(e) {
        if (!this.cameraImplementation) throw new Error("Camera not connected");
        let t = this.mapExposureModeToNumeric(e);
        await this.cameraImplementation.setDeviceProperty("exposureMode", t);
    }
    async getProperty(e) {
        if (!this.cameraImplementation) throw new Error("Camera not connected");
        return this.cameraImplementation.getDeviceProperty(e);
    }
    async setProperty(e, t) {
        if (!this.cameraImplementation) throw new Error("Camera not connected");
        await this.cameraImplementation.setDeviceProperty(e, t);
    }
    async getProperties() {
        if (!this.cameraImplementation) throw new Error("Camera not connected");
        let e = new Map, t = [
            "iso",
            "shutterSpeed",
            "aperture",
            "exposureMode",
            "whiteBalance",
            "focusMode"
        ];
        for (let r of t)try {
            let n = await this.cameraImplementation.getDeviceProperty(r);
            e.set(r, n);
        } catch  {}
        return e;
    }
    async startLiveView(e) {
        throw this.cameraImplementation ? new Error("Live view not yet implemented") : new Error("Camera not connected");
    }
    async stopLiveView() {
        if (!this.cameraImplementation) throw new Error("Camera not connected");
    }
    async listPhotos() {
        if (!this.cameraImplementation) throw new Error("Camera not connected");
        return (await this.cameraImplementation.listImages()).map((t)=>new D(Buffer.alloc(0), t.filename || "unknown"));
    }
    async downloadPhoto(e) {
        if (!this.cameraImplementation) throw new Error("Camera not connected");
        let r = (await this.cameraImplementation.listImages()).find((o)=>o.filename === e.filename);
        if (!r) throw new Error("Photo not found on camera");
        let n = await this.cameraImplementation.downloadImage(r.handle);
        return n instanceof Buffer ? n : Buffer.from(n);
    }
    async deletePhoto(e) {
        if (!this.cameraImplementation) throw new Error("Camera not connected");
        let t = e.filename || "", n = (await this.cameraImplementation.listImages()).find((o)=>(o.filename || "") === t);
        if (!n) throw new Error("Photo not found on camera");
        await this.cameraImplementation.deleteImage(n.handle);
    }
    formatShutterSpeed(e) {
        return typeof e == "string" ? e : typeof e == "number" ? e >= 1 ? `${e}` : `1/${Math.round(1 / e)}` : String(e);
    }
    parseShutterSpeed(e) {
        if (e.includes("/")) {
            let t = e.split("/"), r = t[0] || "1", n = t[1] || "1";
            return parseFloat(r) / parseFloat(n);
        }
        return parseFloat(e);
    }
    formatAperture(e) {
        return typeof e == "string" ? e : typeof e == "number" ? `f/${e}` : String(e);
    }
    parseAperture(e) {
        return e.startsWith("f/") ? parseFloat(e.substring(2)) : parseFloat(e);
    }
    mapExposureMode(e) {
        return typeof e == "string" ? e : ({
            0: "auto",
            1: "manual",
            2: "aperture",
            3: "shutter"
        })[e] || "auto";
    }
    mapExposureModeToNumeric(e) {
        return ({
            auto: 0,
            manual: 1,
            aperture: 2,
            shutter: 3
        })[e];
    }
};
var X = class {
    data;
    width;
    height;
    timestamp;
    constructor(e, t, r, n){
        this.data = e, this.width = t, this.height = r, this.timestamp = n || Date.now();
    }
    get aspectRatio() {
        return this.width / this.height;
    }
    get size() {
        return this.data.length;
    }
    toJSON() {
        return {
            width: this.width,
            height: this.height,
            timestamp: this.timestamp,
            dataSize: this.data.length,
            aspectRatio: this.aspectRatio
        };
    }
};
var ie = ((a)=>(a.AUTO = "auto", a.PROGRAM = "program", a.APERTURE_PRIORITY = "aperturePriority", a.SHUTTER_PRIORITY = "shutterPriority", a.MANUAL = "manual", a.BULB = "bulb", a.SCENE = "scene", a))(ie || {}), ae = ((i)=>(i.MANUAL = "manual", i.AUTO_SINGLE = "autoSingle", i.AUTO_CONTINUOUS = "autoContinuous", i.AUTO_AUTOMATIC = "autoAutomatic", i.DMF = "dmf", i.POWER_FOCUS = "powerFocus", i))(ae || {}), se = ((p)=>(p.AUTO = "auto", p.DAYLIGHT = "daylight", p.CLOUDY = "cloudy", p.SHADE = "shade", p.TUNGSTEN = "tungsten", p.FLUORESCENT = "fluorescent", p.FLASH = "flash", p.CUSTOM = "custom", p.KELVIN = "kelvin", p))(se || {}), ce = ((i)=>(i.SINGLE = "single", i.CONTINUOUS_LOW = "continuousLow", i.CONTINUOUS_HIGH = "continuousHigh", i.SELF_TIMER_2 = "selfTimer2", i.SELF_TIMER_10 = "selfTimer10", i.BRACKETING = "bracketing", i))(ce || {}), pe = ((a)=>(a.RAW = "raw", a.FINE = "fine", a.NORMAL = "normal", a.BASIC = "basic", a.RAW_JPEG_FINE = "rawJpegFine", a.RAW_JPEG_NORMAL = "rawJpegNormal", a.RAW_JPEG_BASIC = "rawJpegBasic", a))(pe || {}), ue = ((a)=>(a.OFF = "off", a.AUTO = "auto", a.FILL = "fill", a.RED_EYE = "redEye", a.SLOW_SYNC = "slowSync", a.REAR_SYNC = "rearSync", a.WIRELESS = "wireless", a))(ue || {}), me = ((o)=>(o.MULTI = "multi", o.CENTER_WEIGHTED = "centerWeighted", o.SPOT = "spot", o.ENTIRE_SCREEN_AVG = "entireScreenAvg", o.HIGHLIGHT = "highlight", o))(me || {}), de = ((i)=>(i.WIDE = "wide", i.ZONE = "zone", i.CENTER = "center", i.FLEXIBLE_SPOT = "flexibleSpot", i.EXPANDED_FLEXIBLE_SPOT = "expandedFlexibleSpot", i.TRACKING = "tracking", i))(de || {}), fe = ((r)=>(r.SRGB = "sRGB", r.ADOBE_RGB = "adobeRGB", r.PRO_PHOTO = "proPhoto", r))(fe || {});
;
 //# sourceMappingURL=web.js.map
}),
"[project]/examples/web/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dist$2f$web$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dist/web.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
;
function Home() {
    const [cameras, setCameras] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [connected, setConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasWebUSB, setHasWebUSB] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Check WebUSB support after mounting (to avoid hydration issues)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setHasWebUSB(!!navigator.usb);
    }, []);
    // Check for already paired devices
    const checkCameras = async ()=>{
        try {
            // First check what WebUSB sees directly
            if (navigator.usb) {
                const usbDevices = await navigator.usb.getDevices();
                console.log('Raw USB devices from navigator.usb.getDevices():', usbDevices);
            }
            const cams = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$dist$2f$web$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["listCameras"])();
            console.log('Found cameras from listCameras():', cams);
            setCameras(cams);
        } catch (err) {
            console.error('Error listing cameras:', err);
            setError(err?.toString() || 'Failed to list cameras');
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        checkCameras();
    }, []);
    // Request permission for a new USB device
    const requestCameraPermission = async ()=>{
        try {
            // Use the library's requestCameraAccess function
            const camera = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$dist$2f$web$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["requestCameraAccess"])();
            if (camera) {
                console.log('Camera access granted:', camera);
                // Add the newly granted camera to the list immediately
                setCameras((prev)=>[
                        ...prev,
                        camera
                    ]);
                // Also refresh the full list
                setTimeout(checkCameras, 100);
            } else {
                setError('No camera selected');
            }
        } catch (err) {
            console.error('Error requesting device:', err);
            setError(err?.toString() || 'Failed to request device');
        }
    };
    // Connect to a camera
    const connectCamera = async ()=>{
        try {
            const camera = new __TURBOPACK__imported__module__$5b$project$5d2f$dist$2f$web$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Camera"]();
            await camera.connect();
            setConnected(true);
            console.log('Connected to camera!');
        } catch (err) {
            console.error('Error connecting:', err);
            setError(err?.toString() || 'Failed to connect');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "font-sans grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 gap-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold mb-4",
                        children: "WebUSB Camera Control"
                    }, void 0, false, {
                        fileName: "[project]/examples/web/app/page.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4",
                        children: [
                            "WebUSB Support: ",
                            hasWebUSB ? '✅ Available' : '❌ Not Available'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/examples/web/app/page.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: requestCameraPermission,
                        className: "bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600",
                        children: "Request Camera Access"
                    }, void 0, false, {
                        fileName: "[project]/examples/web/app/page.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: checkCameras,
                        className: "bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600",
                        children: "Refresh Camera List"
                    }, void 0, false, {
                        fileName: "[project]/examples/web/app/page.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    cameras.length > 0 && !connected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: connectCamera,
                        className: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600",
                        children: "Connect to First Camera"
                    }, void 0, false, {
                        fileName: "[project]/examples/web/app/page.tsx",
                        lineNumber: 101,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/examples/web/app/page.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl mb-2",
                        children: [
                            "Available Cameras: ",
                            cameras.length
                        ]
                    }, void 0, true, {
                        fileName: "[project]/examples/web/app/page.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this),
                    cameras.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-500",
                        children: 'No cameras found. Click "Request Camera Access" to grant permission.'
                    }, void 0, false, {
                        fileName: "[project]/examples/web/app/page.tsx",
                        lineNumber: 114,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: cameras.map((camera, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border p-2 rounded",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Vendor: ",
                                            camera.vendor
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/examples/web/app/page.tsx",
                                        lineNumber: 121,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Model: ",
                                            camera.model
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/examples/web/app/page.tsx",
                                        lineNumber: 122,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Serial: ",
                                            camera.serialNumber || 'N/A'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/examples/web/app/page.tsx",
                                        lineNumber: 123,
                                        columnNumber: 17
                                    }, this),
                                    camera.usb && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-600",
                                        children: [
                                            "USB: ",
                                            camera.usb.vendorId.toString(16),
                                            ":",
                                            camera.usb.productId.toString(16)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/examples/web/app/page.tsx",
                                        lineNumber: 125,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, camera.serialNumber || idx, true, {
                                fileName: "[project]/examples/web/app/page.tsx",
                                lineNumber: 120,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/examples/web/app/page.tsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, this),
                    connected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 text-green-600 font-bold",
                        children: "✅ Camera Connected!"
                    }, void 0, false, {
                        fileName: "[project]/examples/web/app/page.tsx",
                        lineNumber: 135,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/examples/web/app/page.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-red-500 text-center",
                children: [
                    "Error: ",
                    error
                ]
            }, void 0, true, {
                fileName: "[project]/examples/web/app/page.tsx",
                lineNumber: 143,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/examples/web/app/page.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
}),
"[project]/examples/web/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/examples/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/examples/web/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/examples/web/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/examples/web/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cef8770d._.js.map
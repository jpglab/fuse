(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/dist/web.js [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/examples/web/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/web/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
;
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
}, ge = Object.entries(m).reduce((s, param)=>{
    let [e, t] = param;
    return s[t] = e, s;
}, {}), Se = Object.entries(l).reduce((s, param)=>{
    let [e, t] = param;
    return s[t] = e, s;
}, {}), _e = Object.entries(he).reduce((s, param)=>{
    let [e, t] = param;
    return s[t] = e, s;
}, {}), Pe = Object.entries(T).reduce((s, param)=>{
    let [e, t] = param;
    return s[t] = e, s;
}, {});
var x = class extends Error {
    constructor(t, r, n){
        super(r);
        this.code = t;
        this.operation = n;
        this.name = "PTPError";
    }
};
var v = class {
    getNextTransactionId() {
        return this.transactionId++, this.transactionId > 4294967295 && (this.transactionId = 1), this.transactionId;
    }
    buildCommand(e) {
        let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
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
                throw new Error("Unknown container type: 0x".concat(e.toString(16)));
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
                throw new Error("Unknown message type: 0x".concat(r.toString(16)));
        }
    }
    resetTransactionId() {
        this.transactionId = 0;
    }
    getCurrentTransactionId() {
        return this.transactionId;
    }
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "transactionId", 0);
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
    return "f/".concat((s / 100).toFixed(1));
}
function Z(s) {
    if (s === 0) return "BULB";
    if (s === 4294967295) return "N/A";
    let e = s >> 16 & 65535, t = s & 65535;
    return t === 10 ? "".concat(e / 10, '"') : e === 1 ? "1/".concat(t) : "".concat(e, "/").concat(t);
}
_c = Z;
function Q(s) {
    if (s === 16777215) return "ISO AUTO";
    if (s === 33554431) return "Multi Frame NR ISO AUTO";
    if (s === 50331647) return "Multi Frame NR High ISO AUTO";
    let e = s >> 24 & 255, t = "";
    e === 1 ? t = "Multi Frame NR " : e === 2 && (t = "Multi Frame NR High ");
    let r = s & 16777215;
    return r >= 10 && r <= 1e6 ? "".concat(t, "ISO ").concat(r) : "ISO Unknown";
}
_c1 = Q;
var R = class s {
    async openSession(e) {
        if (console.log("PTP Protocol: Opening session with ID ".concat(e)), this.isOpen) {
            console.log("PTP Protocol: Session already marked as open locally");
            return;
        }
        let t = this.messageBuilder.buildCommand(m.OPEN_SESSION, [
            e
        ]);
        console.log("PTP Protocol: Sending OpenSession command..."), await this.transport.send(t), console.log("PTP Protocol: OpenSession command sent, waiting for response...");
        let r = await this.transport.receive(512), n = this.messageBuilder.parseResponse(r);
        if (console.log("PTP Protocol: OpenSession response received: 0x".concat(n.code.toString(16))), n.code === l.SESSION_ALREADY_OPEN) {
            console.log("PTP Protocol: Camera says session already open, continuing..."), this.sessionId = e, this.isOpen = !0;
            return;
        }
        if (n.code !== l.OK) throw new x(n.code, "Failed to open session: 0x".concat(n.code.toString(16).padStart(4, "0")), "OpenSession");
        this.sessionId = e, this.isOpen = !0;
    }
    async closeSession() {
        if (this.isOpen) try {
            let e = this.messageBuilder.buildCommand(m.CLOSE_SESSION);
            await this.transport.send(e);
            let t = await this.transport.receive(512), r = this.messageBuilder.parseResponse(t);
            r.code !== l.OK && r.code !== l.SESSION_NOT_OPEN && console.warn("CloseSession returned: 0x".concat(r.code.toString(16).padStart(4, "0")));
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
    constructor(e, t){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "sessionId", null);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "isOpen", !1);
        this.transport = e;
        this.messageBuilder = t;
    }
};
var y = ((u)=>(u.APERTURE = "aperture", u.SHUTTER_SPEED = "shutterSpeed", u.ISO = "iso", u.EXPOSURE_COMPENSATION = "exposureCompensation", u.EXPOSURE_MODE = "exposureMode", u.EXPOSURE_METERING_MODE = "exposureMeteringMode", u.FOCUS_MODE = "focusMode", u.FOCUS_AREA = "focusArea", u.FOCUS_DISTANCE = "focusDistance", u.AF_MODE = "afMode", u.AF_AREA_MODE = "afAreaMode", u.IMAGE_QUALITY = "imageQuality", u.IMAGE_SIZE = "imageSize", u.IMAGE_FORMAT = "imageFormat", u.WHITE_BALANCE = "whiteBalance", u.COLOR_SPACE = "colorSpace", u.CAPTURE_MODE = "captureMode", u.DRIVE_MODE = "driveMode", u.BURST_NUMBER = "burstNumber", u.BRACKETING_MODE = "bracketingMode", u.FLASH_MODE = "flashMode", u.FLASH_COMPENSATION = "flashCompensation", u.FLASH_SYNC_MODE = "flashSyncMode", u.BATTERY_LEVEL = "batteryLevel", u.DEVICE_NAME = "deviceName", u.SERIAL_NUMBER = "serialNumber", u.FIRMWARE_VERSION = "firmwareVersion", u.DATE_TIME = "dateTime", u.VIDEO_QUALITY = "videoQuality", u.VIDEO_FRAMERATE = "videoFramerate", u.AUDIO_RECORDING = "audioRecording", u.CUSTOM_FUNCTION = "customFunction", u.COPYRIGHT_INFO = "copyrightInfo", u.ARTIST = "artist", u))(y || {}), ee = ((a)=>(a.STRING = "string", a.NUMBER = "number", a.BOOLEAN = "boolean", a.DATE = "date", a.ARRAY = "array", a.FRACTION = "fraction", a.ENUM = "enum", a))(ee || {}), te = ((p)=>(p.SECONDS = "seconds", p.FRACTION = "fraction", p.F_STOP = "fStop", p.ISO_VALUE = "iso", p.PERCENTAGE = "percentage", p.EV = "ev", p.METERS = "meters", p.KELVIN = "kelvin", p.FRAMES_PER_SECOND = "fps", p))(te || {});
var U = class {
    mapToVendor(e) {
        let t = this.genericToVendor.get(e);
        if (t === void 0) throw new Error("Property ".concat(e, " not supported by generic mapper"));
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
                return typeof t == "number" ? "f/".concat((t / 100).toFixed(1)) : String(t);
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
                    } catch (e) {
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
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "genericToVendor", new Map([
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
        ]));
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "vendorToGeneric", new Map);
        this.genericToVendor.forEach((e, t)=>{
            this.vendorToGeneric.set(e, t);
        });
    }
};
var L = ((c)=>(c.JPEG = "jpeg", c.RAW = "raw", c.TIFF = "tiff", c.BMP = "bmp", c.PNG = "png", c.HEIF = "heif", c.DNG = "dng", c.ARW = "arw", c.CR2 = "cr2", c.NEF = "nef", c))(L || {});
var A = class {
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
        if (e.code !== l.OK) throw new Error("Capture failed: 0x".concat(e.code.toString(16)));
    }
    async getDeviceProperty(e) {
        let t = this.propertyMapper.mapToVendor(e), r = await this.protocol.sendOperation({
            code: m.GET_DEVICE_PROP_VALUE,
            parameters: [
                t
            ]
        });
        if (r.code !== l.OK) throw new Error("Failed to get property ".concat(e, ": 0x").concat(r.code.toString(16)));
        if (!r.data) throw new Error("No data received for property ".concat(e));
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
        if (i.code !== l.OK) throw new Error("Failed to set property ".concat(e, ": 0x").concat(i.code.toString(16)));
    }
    async getPropertyDescriptor(e) {
        let t = this.propertyMapper.mapToVendor(e), r = await this.protocol.sendOperation({
            code: m.GET_DEVICE_PROP_DESC,
            parameters: [
                t
            ]
        });
        if (r.code !== l.OK) throw new Error("Failed to get property descriptor: 0x".concat(r.code.toString(16)));
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
        if (e.code !== l.OK) throw new Error("Failed to list images: 0x".concat(e.code.toString(16)));
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
        if (t.code !== l.OK) throw new Error("Failed to download image: 0x".concat(t.code.toString(16)));
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
        if (t.code !== l.OK) throw new Error("Failed to delete image: 0x".concat(t.code.toString(16)));
    }
    async getCameraInfo() {
        let e = await this.protocol.sendOperation({
            code: m.GET_DEVICE_INFO,
            parameters: []
        });
        if (e.code !== l.OK) throw new Error("Failed to get device info: 0x".concat(e.code.toString(16)));
        return this.parseDeviceInfo(e.data);
    }
    async getStorageInfo() {
        let e = await this.protocol.sendOperation({
            code: m.GET_STORAGE_IDS,
            parameters: []
        });
        if (e.code !== l.OK) throw new Error("Failed to get storage IDs: 0x".concat(e.code.toString(16)));
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
            throw new Error("Cannot encode property value of type ".concat(typeof e));
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
                filename: "IMG_".concat(e, ".jpg"),
                captureDate: new Date,
                modificationDate: new Date
            };
        } catch (e) {
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
        } catch (e) {
            return null;
        }
    }
    constructor(e, t){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "sessionId", 1);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "connected", !1);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "liveViewActive", !1);
        this.protocol = e;
        this.propertyMapper = t;
    }
};
var M = class {
    mapToVendor(e) {
        let t = this.genericToVendor.get(e);
        if (t === void 0) throw new Error("Property ".concat(e, " not supported by Sony"));
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
                return t !== null && t !== void 0 ? t : "";
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
            if (r === 1 && n > 1) return "1/".concat(n);
            if (n !== 0) {
                let o = r / n;
                return o >= 1 ? "".concat(o, '"') : "1/".concat(Math.round(1 / o));
            }
        }
        return "Unknown";
    }
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "genericToVendor", new Map([
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
        ]));
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "vendorToGeneric", new Map([
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
        ]));
    }
};
var w = class {
    async authenticate(e) {
        console.log("Sony Auth: Starting Phase 1 - Initial handshake"), await this.sdioConnect(e, C.INITIAL_HANDSHAKE), console.log("Sony Auth: Phase 1 complete"), console.log("Sony Auth: Starting Phase 2 - Capability exchange"), await this.sdioConnect(e, C.CAPABILITY_EXCHANGE), console.log("Sony Auth: Phase 2 complete"), console.log("Sony Auth: Getting extended device info"), await this.getExtDeviceInfo(e), console.log("Sony Auth: Extended device info retrieved"), console.log("Sony Auth: Starting Phase 3 - Final authentication"), await this.sdioConnect(e, C.FINAL_AUTHENTICATION), console.log("Sony Auth: Phase 3 complete - Authentication successful!");
    }
    async sdioConnect(e, t) {
        console.log("Sony Auth: Sending SDIO_CONNECT for phase ".concat(t));
        let r = await e.sendOperation({
            code: I.SDIO_CONNECT,
            parameters: [
                t,
                0,
                0
            ],
            hasDataPhase: !0
        });
        if (console.log("Sony Auth: SDIO_CONNECT response: 0x".concat(r.code.toString(16))), r.code !== l.OK) throw new Error("SDIO Connect Phase ".concat(t, " failed: 0x").concat(r.code.toString(16)));
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
        if (t.code !== l.OK) throw new Error("Get extended device info failed: 0x".concat(t.code.toString(16)));
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
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "deviceInfo", null);
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
    async connect() {
        try {
            await this.protocol.closeSession();
        } catch (e) {}
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
            console.log("Image size: ".concat(N, " bytes"));
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
        console.log("Live view dataset length: ".concat(p.length)), p.length > 20 && console.log("First 20 bytes of dataset: ".concat(Array.from(p.slice(0, 20)).map((O)=>"0x".concat(O.toString(16).padStart(2, "0"))).join(" ")));
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
            return console.log("Failed to set OSD mode: ".concat(String(t))), !1;
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
        if (e.code !== l.OK) throw new Error("GetOSDImage failed with code 0x".concat(e.code.toString(16)));
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
        console.log("Looking for property ".concat(e, " with vendor code 0x").concat(t.toString(16)));
        let r = this.extractPropertyValue(t);
        if (r === void 0) switch(console.log("Warning: Property ".concat(e, " (0x").concat(t.toString(16), ") not found, using default")), e){
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
            n = a.getUint16(4, !0), r = a.getUint32(8, !0), console.log("File size: ".concat(r, " bytes"));
            let f = ".jpg";
            n === 45313 ? f = ".arw" : n === 14338 && (f = ".tiff"), t = "IMG_".concat(new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5)).concat(f);
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
        if (console.log("LiveView dataset: offset=".concat(r, ", size=").concat(n, ", dataLength=").concat(e.length)), n === 0) return {
            jpeg: new Uint8Array(0)
        };
        if (r >= e.length || r + n > e.length) return console.log("Invalid offsets: offset=".concat(r, ", size=").concat(n, ", dataLength=").concat(e.length)), null;
        let o = e.slice(r, r + n);
        return o.length >= 2 && o[0] === 255 && o[1] === 216 && console.log("Valid JPEG found: ".concat(o.length, " bytes")), {
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
        if (e.code !== l.OK) throw new Error("Failed to get extended device properties: 0x".concat(e.code.toString(16)));
        if (!e.data || e.data.length < 12) throw new Error("No property data received");
        console.log("Received ".concat(e.data.length, " bytes for GET_ALL_EXT_DEVICE_PROP_INFO")), console.log("First 20 bytes: ".concat(Array.from(e.data.slice(0, 20)).map((r)=>"0x".concat(r.toString(16).padStart(2, "0"))).join(" "))), this.cachedProperties = this.parseAllExtDevicePropInfo(e.data), console.log("Parsed ".concat(this.cachedProperties.size, " properties out of 370"));
        let t = [
            53790,
            53773,
            20487
        ];
        for (let r of t)this.cachedProperties.has(r) ? console.log("  Found property 0x".concat(r.toString(16), ": ").concat(this.cachedProperties.get(r).currentValue)) : console.log("  Missing property 0x".concat(r.toString(16)));
        if (this.cachedProperties.size < 100) {
            let r = Array.from(this.cachedProperties.keys()).map((n)=>"0x".concat(n.toString(16))).join(", ");
            console.log("All property codes found: ".concat(r));
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
        } catch (e) {
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
        } catch (e) {
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
        var _this_cachedProperties_get;
        return this.cachedProperties ? (_this_cachedProperties_get = this.cachedProperties.get(e)) === null || _this_cachedProperties_get === void 0 ? void 0 : _this_cachedProperties_get.currentValue : void 0;
    }
    formatAperture(e) {
        return typeof e == "number" ? "f/".concat((e / 100).toFixed(1)) : String(e);
    }
    formatShutterSpeed(e) {
        if (typeof e == "number") {
            if (e === 0) return "BULB";
            if (e === 4294967295) return "N/A";
            let t = e >> 16 & 65535, r = e & 65535;
            if (r === 10) return "".concat(t / 10, '"');
            if (t === 1) return "1/".concat(r);
            if (r !== 0) return "".concat(t, "/").concat(r);
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
            if (n >= 10 && n <= 1e6) return "".concat(r, "ISO ").concat(n);
        }
        return "Unknown";
    }
    constructor(e, t){
        super(e, new M), (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "sonyAuthenticator", void 0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "lastLiveViewTime", 0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "cachedProperties", null), (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "propertiesLastFetched", 0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "PROPERTIES_CACHE_TTL", 5e3), this.sonyAuthenticator = t || new w;
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
_c2 = Ie;
async function B(s) {
    var _s_usb, _s_usb1;
    let e = new _, t = new S, r = {
        vendorId: (s === null || s === void 0 ? void 0 : (_s_usb = s.usb) === null || _s_usb === void 0 ? void 0 : _s_usb.vendorId) || 0,
        productId: (s === null || s === void 0 ? void 0 : (_s_usb1 = s.usb) === null || _s_usb1 === void 0 ? void 0 : _s_usb1.productId) || 0
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
    if ((s === null || s === void 0 ? void 0 : s.vendor) && (o = o.filter((i)=>i.vendor.toLowerCase() === s.vendor.toLowerCase())), (s === null || s === void 0 ? void 0 : s.model) && (o = o.filter((i)=>i.model.toLowerCase().includes(s.model.toLowerCase()))), (s === null || s === void 0 ? void 0 : s.serialNumber) && (o = o.filter((i)=>i.serialNumber === s.serialNumber)), (s === null || s === void 0 ? void 0 : s.ip) && s.ip.host) {
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
_c3 = B;
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
_c4 = Te;
var F = class {
    on(e, t) {
        return this.events.has(e) || this.events.set(e, []), this.events.get(e).push(t), this;
    }
    once(e, t) {
        var _this = this;
        let r = function() {
            for(var _len = arguments.length, n = new Array(_len), _key = 0; _key < _len; _key++){
                n[_key] = arguments[_key];
            }
            _this.off(e, r), t.apply(_this, n);
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
    emit(e) {
        for(var _len = arguments.length, t = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            t[_key - 1] = arguments[_key];
        }
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
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "events", new Map);
    }
};
var K = ((r)=>(r.BULK_IN = "bulk_in", r.BULK_OUT = "bulk_out", r.INTERRUPT = "interrupt", r))(K || {});
var G = class {
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
        })), !r) throw new Error("Device not found: ".concat(e.vendorId, ":").concat(e.productId));
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
                } catch (e) {}
            }
            this.device = null, this.interface = null, this.endpoints = null, this.connected = !1;
        }
    }
    async send(e) {
        if (!this.connected || !this.endpoints) throw new Error("Not connected");
        let t = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(e), r = this.isWebEnvironment ? this.endpoints.bulkOut.endpointNumber : this.endpoints.bulkOut.descriptor.bEndpointAddress;
        if (console.log("USB Transport: Sending ".concat(t.length, " bytes to endpoint 0x").concat(r.toString(16))), this.isWebEnvironment) {
            let n = await this.device.transferOut(this.endpoints.bulkOut.endpointNumber, t);
            if (n.status !== "ok") throw new Error("Transfer failed: ".concat(n.status));
        } else return new Promise((n, o)=>{
            let i = (a)=>{
                console.log("USB Transport: Transfer callback, error: ".concat(a)), a ? this.handleNodeUSBError(a, t, n, o) : n();
            };
            console.log("USB Transport: Calling transfer with ".concat(t.length, " bytes")), this.endpoints.bulkOut.transfer(t, i);
        });
    }
    async receive() {
        let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 8192;
        if (!this.connected || !this.endpoints) throw new Error("Not connected");
        if (this.isWebEnvironment) {
            let t = await this.device.transferIn(this.endpoints.bulkIn.endpointNumber, e);
            if (t.status !== "ok") throw new Error("Transfer failed: ".concat(t.status));
            return new Uint8Array(t.data.buffer);
        } else return new Promise((t, r)=>{
            let n = (o, i)=>{
                var _o_message;
                o ? o.errno === 4 || o.errno === -9 || ((_o_message = o.message) === null || _o_message === void 0 ? void 0 : _o_message.includes("STALL")) ? (console.log("USB receive stall detected, clearing halt..."), this.endpointManager.clearHalt("bulk_in").then(()=>{
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
        } catch (e) {}
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
        var _e_message, _e_message1;
        console.log("USB Transport: Handling error - errno: ".concat(e.errno, ", message: ").concat(e.message)), e.errno === -9 || e.errno === 4 || ((_e_message = e.message) === null || _e_message === void 0 ? void 0 : _e_message.includes("PIPE")) || ((_e_message1 = e.message) === null || _e_message1 === void 0 ? void 0 : _e_message1.includes("STALL")) ? (console.log("USB Transport: Clearing halt and retrying..."), this.endpointManager.clearHalt("bulk_out").then(()=>{
            console.log("USB Transport: Halt cleared, retrying transfer..."), this.endpoints.bulkOut.transfer(t, (o)=>{
                o ? (console.log("USB Transport: Retry failed: ".concat(o)), n(o)) : (console.log("USB Transport: Retry successful!"), r());
            });
        }).catch((o)=>{
            console.log("USB Transport: Failed to clear halt: ".concat(o)), n(e);
        })) : n(e);
    }
    constructor(e, t){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "device", null);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "interface", null);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "endpoints", null);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "connected", !1);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "isWebEnvironment", typeof navigator < "u" && "usb" in navigator);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "deviceInfo", null);
        this.deviceFinder = e;
        this.endpointManager = t;
    }
};
var H = class {
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
    constructor(){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "configuration", null);
    }
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
                throw new Error("Unknown transport type: ".concat(e));
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
    constructor(e, t, r){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "data", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "filename", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "size", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "capturedAt", void 0);
        this.data = e, this.filename = t, this.size = e instanceof ArrayBuffer ? e.byteLength : e.length, this.capturedAt = r || new Date;
    }
};
var J = class extends F {
    async connect() {
        var _this_options_usb, _this_options_ip;
        if (!((_this_options_usb = this.options.usb) === null || _this_options_usb === void 0 ? void 0 : _this_options_usb.productId) && !((_this_options_ip = this.options.ip) === null || _this_options_ip === void 0 ? void 0 : _this_options_ip.host)) {
            let e = await B(this.options);
            if (e.length === 0) {
                var _this_options_usb1;
                let r = [];
                this.options.vendor && r.push("vendor: ".concat(this.options.vendor)), this.options.model && r.push("model: ".concat(this.options.model)), ((_this_options_usb1 = this.options.usb) === null || _this_options_usb1 === void 0 ? void 0 : _this_options_usb1.vendorId) && r.push("USB vendor: 0x".concat(this.options.usb.vendorId.toString(16)));
                let n = r.length > 0 ? " matching filters: ".concat(r.join(", ")) : "";
                throw new Error("No cameras found".concat(n, ". Please connect a camera via USB."));
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
        var _this_options_usb, _this_options_usb1, _this_options_usb2, _this_options_usb3;
        if (this.options.ip) throw new Error("IP connections not yet implemented");
        let e = this.transportFactory.create("usb", {
            timeout: this.options.timeout
        });
        await e.connect({
            vendorId: ((_this_options_usb = this.options.usb) === null || _this_options_usb === void 0 ? void 0 : _this_options_usb.vendorId) || 0,
            productId: ((_this_options_usb1 = this.options.usb) === null || _this_options_usb1 === void 0 ? void 0 : _this_options_usb1.productId) || 0,
            serialNumber: this.options.serialNumber
        });
        let t = this.options.vendor || this.cameraFactory.detectVendor(((_this_options_usb2 = this.options.usb) === null || _this_options_usb2 === void 0 ? void 0 : _this_options_usb2.vendorId) || 0, ((_this_options_usb3 = this.options.usb) === null || _this_options_usb3 === void 0 ? void 0 : _this_options_usb3.productId) || 0);
        this.cameraImplementation = this.cameraFactory.create(t, e), await this.cameraImplementation.connect(), this._vendor || (this._vendor = this.options.vendor || t), this._model || (this._model = this.options.model || "Unknown"), this._serialNumber || (this._serialNumber = this.options.serialNumber || "Unknown");
    }
    async disconnect() {
        this.cameraImplementation && (await this.cameraImplementation.disconnect(), this.cameraImplementation = void 0), this.emit("disconnect");
    }
    isConnected() {
        var _this_cameraImplementation;
        return ((_this_cameraImplementation = this.cameraImplementation) === null || _this_cameraImplementation === void 0 ? void 0 : _this_cameraImplementation.isConnected()) || !1;
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
            let r = await this.cameraImplementation.downloadImage(t.handle), n = r instanceof __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"] ? r : __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(r), o = new D(n, t.filename || "unknown");
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
        } catch (e) {}
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
        return (await this.cameraImplementation.listImages()).map((t)=>new D(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].alloc(0), t.filename || "unknown"));
    }
    async downloadPhoto(e) {
        if (!this.cameraImplementation) throw new Error("Camera not connected");
        let r = (await this.cameraImplementation.listImages()).find((o)=>o.filename === e.filename);
        if (!r) throw new Error("Photo not found on camera");
        let n = await this.cameraImplementation.downloadImage(r.handle);
        return n instanceof __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"] ? n : __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(n);
    }
    async deletePhoto(e) {
        if (!this.cameraImplementation) throw new Error("Camera not connected");
        let t = e.filename || "", n = (await this.cameraImplementation.listImages()).find((o)=>(o.filename || "") === t);
        if (!n) throw new Error("Photo not found on camera");
        await this.cameraImplementation.deleteImage(n.handle);
    }
    formatShutterSpeed(e) {
        return typeof e == "string" ? e : typeof e == "number" ? e >= 1 ? "".concat(e) : "1/".concat(Math.round(1 / e)) : String(e);
    }
    parseShutterSpeed(e) {
        if (e.includes("/")) {
            let t = e.split("/"), r = t[0] || "1", n = t[1] || "1";
            return parseFloat(r) / parseFloat(n);
        }
        return parseFloat(e);
    }
    formatAperture(e) {
        return typeof e == "string" ? e : typeof e == "number" ? "f/".concat(e) : String(e);
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
    constructor(e){
        super(), (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "options", void 0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "cameraImplementation", void 0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "transportFactory", void 0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "cameraFactory", void 0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "_vendor", void 0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "_model", void 0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "_serialNumber", void 0), this.options = e || {}, this.transportFactory = new $, this.cameraFactory = new S;
    }
};
var X = class {
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
    constructor(e, t, r, n){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "data", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "width", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "height", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "timestamp", void 0);
        this.data = e, this.width = t, this.height = r, this.timestamp = n || Date.now();
    }
};
var ie = ((a)=>(a.AUTO = "auto", a.PROGRAM = "program", a.APERTURE_PRIORITY = "aperturePriority", a.SHUTTER_PRIORITY = "shutterPriority", a.MANUAL = "manual", a.BULB = "bulb", a.SCENE = "scene", a))(ie || {}), ae = ((i)=>(i.MANUAL = "manual", i.AUTO_SINGLE = "autoSingle", i.AUTO_CONTINUOUS = "autoContinuous", i.AUTO_AUTOMATIC = "autoAutomatic", i.DMF = "dmf", i.POWER_FOCUS = "powerFocus", i))(ae || {}), se = ((p)=>(p.AUTO = "auto", p.DAYLIGHT = "daylight", p.CLOUDY = "cloudy", p.SHADE = "shade", p.TUNGSTEN = "tungsten", p.FLUORESCENT = "fluorescent", p.FLASH = "flash", p.CUSTOM = "custom", p.KELVIN = "kelvin", p))(se || {}), ce = ((i)=>(i.SINGLE = "single", i.CONTINUOUS_LOW = "continuousLow", i.CONTINUOUS_HIGH = "continuousHigh", i.SELF_TIMER_2 = "selfTimer2", i.SELF_TIMER_10 = "selfTimer10", i.BRACKETING = "bracketing", i))(ce || {}), pe = ((a)=>(a.RAW = "raw", a.FINE = "fine", a.NORMAL = "normal", a.BASIC = "basic", a.RAW_JPEG_FINE = "rawJpegFine", a.RAW_JPEG_NORMAL = "rawJpegNormal", a.RAW_JPEG_BASIC = "rawJpegBasic", a))(pe || {}), ue = ((a)=>(a.OFF = "off", a.AUTO = "auto", a.FILL = "fill", a.RED_EYE = "redEye", a.SLOW_SYNC = "slowSync", a.REAR_SYNC = "rearSync", a.WIRELESS = "wireless", a))(ue || {}), me = ((o)=>(o.MULTI = "multi", o.CENTER_WEIGHTED = "centerWeighted", o.SPOT = "spot", o.ENTIRE_SCREEN_AVG = "entireScreenAvg", o.HIGHLIGHT = "highlight", o))(me || {}), de = ((i)=>(i.WIDE = "wide", i.ZONE = "zone", i.CENTER = "center", i.FLEXIBLE_SPOT = "flexibleSpot", i.EXPANDED_FLEXIBLE_SPOT = "expandedFlexibleSpot", i.TRACKING = "tracking", i))(de || {}), fe = ((r)=>(r.SRGB = "sRGB", r.ADOBE_RGB = "adobeRGB", r.PRO_PHOTO = "proPhoto", r))(fe || {});
;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "Z");
__turbopack_context__.k.register(_c1, "Q");
__turbopack_context__.k.register(_c2, "Ie");
__turbopack_context__.k.register(_c3, "B");
__turbopack_context__.k.register(_c4, "Te");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=web.js.map
}),
"[project]/examples/web/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$dist$2f$web$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/dist/web.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function Home() {
    _s();
    const [cameras, setCameras] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [connected, setConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasWebUSB, setHasWebUSB] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Check WebUSB support after mounting (to avoid hydration issues)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            setHasWebUSB(!!navigator.usb);
        }
    }["Home.useEffect"], []);
    // Check for already paired devices
    const checkCameras = async ()=>{
        try {
            // First check what WebUSB sees directly
            if (navigator.usb) {
                const usbDevices = await navigator.usb.getDevices();
                console.log('Raw USB devices from navigator.usb.getDevices():', usbDevices);
            }
            const cams = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$dist$2f$web$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listCameras"])();
            console.log('Found cameras from listCameras():', cams);
            setCameras(cams);
        } catch (err) {
            console.error('Error listing cameras:', err);
            setError((err === null || err === void 0 ? void 0 : err.toString()) || 'Failed to list cameras');
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            checkCameras();
        }
    }["Home.useEffect"], []);
    // Request permission for a new USB device
    const requestCameraPermission = async ()=>{
        try {
            // Use the library's requestCameraAccess function
            const camera = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$dist$2f$web$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["requestCameraAccess"])();
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
            setError((err === null || err === void 0 ? void 0 : err.toString()) || 'Failed to request device');
        }
    };
    // Connect to a camera
    const connectCamera = async ()=>{
        try {
            const camera = new __TURBOPACK__imported__module__$5b$project$5d2f$dist$2f$web$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Camera"]();
            await camera.connect();
            setConnected(true);
            console.log('Connected to camera!');
        } catch (err) {
            console.error('Error connecting:', err);
            setError((err === null || err === void 0 ? void 0 : err.toString()) || 'Failed to connect');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "font-sans grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 gap-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold mb-4",
                        children: "WebUSB Camera Control"
                    }, void 0, false, {
                        fileName: "[project]/examples/web/app/page.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: requestCameraPermission,
                        className: "bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600",
                        children: "Request Camera Access"
                    }, void 0, false, {
                        fileName: "[project]/examples/web/app/page.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: checkCameras,
                        className: "bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600",
                        children: "Refresh Camera List"
                    }, void 0, false, {
                        fileName: "[project]/examples/web/app/page.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    cameras.length > 0 && !connected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
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
                    cameras.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-500",
                        children: 'No cameras found. Click "Request Camera Access" to grant permission.'
                    }, void 0, false, {
                        fileName: "[project]/examples/web/app/page.tsx",
                        lineNumber: 114,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: cameras.map((camera, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border p-2 rounded",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Vendor: ",
                                            camera.vendor
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/examples/web/app/page.tsx",
                                        lineNumber: 121,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Model: ",
                                            camera.model
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/examples/web/app/page.tsx",
                                        lineNumber: 122,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Serial: ",
                                            camera.serialNumber || 'N/A'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/examples/web/app/page.tsx",
                                        lineNumber: 123,
                                        columnNumber: 17
                                    }, this),
                                    camera.usb && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    connected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
_s(Home, "YVh9w5Tyei3Wrlb09U+DbjU71p0=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/examples/web/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/examples/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        "object" === typeof node && null !== node && node.$$typeof === REACT_ELEMENT_TYPE && node._store && (node._store.validated = 1);
    }
    var React = __turbopack_context__.r("[project]/examples/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/examples/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/examples/web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/examples/web/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/examples/web/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

(function() {
    var e = {
        675: function(e, r) {
            "use strict";
            r.byteLength = byteLength;
            r.toByteArray = toByteArray;
            r.fromByteArray = fromByteArray;
            var t = [];
            var f = [];
            var n = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
            var i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            for(var o = 0, u = i.length; o < u; ++o){
                t[o] = i[o];
                f[i.charCodeAt(o)] = o;
            }
            f["-".charCodeAt(0)] = 62;
            f["_".charCodeAt(0)] = 63;
            function getLens(e) {
                var r = e.length;
                if (r % 4 > 0) {
                    throw new Error("Invalid string. Length must be a multiple of 4");
                }
                var t = e.indexOf("=");
                if (t === -1) t = r;
                var f = t === r ? 0 : 4 - t % 4;
                return [
                    t,
                    f
                ];
            }
            function byteLength(e) {
                var r = getLens(e);
                var t = r[0];
                var f = r[1];
                return (t + f) * 3 / 4 - f;
            }
            function _byteLength(e, r, t) {
                return (r + t) * 3 / 4 - t;
            }
            function toByteArray(e) {
                var r;
                var t = getLens(e);
                var i = t[0];
                var o = t[1];
                var u = new n(_byteLength(e, i, o));
                var a = 0;
                var s = o > 0 ? i - 4 : i;
                var h;
                for(h = 0; h < s; h += 4){
                    r = f[e.charCodeAt(h)] << 18 | f[e.charCodeAt(h + 1)] << 12 | f[e.charCodeAt(h + 2)] << 6 | f[e.charCodeAt(h + 3)];
                    u[a++] = r >> 16 & 255;
                    u[a++] = r >> 8 & 255;
                    u[a++] = r & 255;
                }
                if (o === 2) {
                    r = f[e.charCodeAt(h)] << 2 | f[e.charCodeAt(h + 1)] >> 4;
                    u[a++] = r & 255;
                }
                if (o === 1) {
                    r = f[e.charCodeAt(h)] << 10 | f[e.charCodeAt(h + 1)] << 4 | f[e.charCodeAt(h + 2)] >> 2;
                    u[a++] = r >> 8 & 255;
                    u[a++] = r & 255;
                }
                return u;
            }
            function tripletToBase64(e) {
                return t[e >> 18 & 63] + t[e >> 12 & 63] + t[e >> 6 & 63] + t[e & 63];
            }
            function encodeChunk(e, r, t) {
                var f;
                var n = [];
                for(var i = r; i < t; i += 3){
                    f = (e[i] << 16 & 16711680) + (e[i + 1] << 8 & 65280) + (e[i + 2] & 255);
                    n.push(tripletToBase64(f));
                }
                return n.join("");
            }
            function fromByteArray(e) {
                var r;
                var f = e.length;
                var n = f % 3;
                var i = [];
                var o = 16383;
                for(var u = 0, a = f - n; u < a; u += o){
                    i.push(encodeChunk(e, u, u + o > a ? a : u + o));
                }
                if (n === 1) {
                    r = e[f - 1];
                    i.push(t[r >> 2] + t[r << 4 & 63] + "==");
                } else if (n === 2) {
                    r = (e[f - 2] << 8) + e[f - 1];
                    i.push(t[r >> 10] + t[r >> 4 & 63] + t[r << 2 & 63] + "=");
                }
                return i.join("");
            }
        },
        72: function(e, r, t) {
            "use strict";
            /*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */ var f = t(675);
            var n = t(783);
            var i = typeof Symbol === "function" && typeof Symbol.for === "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
            r.Buffer = Buffer;
            r.SlowBuffer = SlowBuffer;
            r.INSPECT_MAX_BYTES = 50;
            var o = 2147483647;
            r.kMaxLength = o;
            Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();
            if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
                console.error("This browser lacks typed array (Uint8Array) support which is required by " + "`buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
            }
            function typedArraySupport() {
                try {
                    var e = new Uint8Array(1);
                    var r = {
                        foo: function() {
                            return 42;
                        }
                    };
                    Object.setPrototypeOf(r, Uint8Array.prototype);
                    Object.setPrototypeOf(e, r);
                    return e.foo() === 42;
                } catch (e) {
                    return false;
                }
            }
            Object.defineProperty(Buffer.prototype, "parent", {
                enumerable: true,
                get: function() {
                    if (!Buffer.isBuffer(this)) return undefined;
                    return this.buffer;
                }
            });
            Object.defineProperty(Buffer.prototype, "offset", {
                enumerable: true,
                get: function() {
                    if (!Buffer.isBuffer(this)) return undefined;
                    return this.byteOffset;
                }
            });
            function createBuffer(e) {
                if (e > o) {
                    throw new RangeError('The value "' + e + '" is invalid for option "size"');
                }
                var r = new Uint8Array(e);
                Object.setPrototypeOf(r, Buffer.prototype);
                return r;
            }
            function Buffer(e, r, t) {
                if (typeof e === "number") {
                    if (typeof r === "string") {
                        throw new TypeError('The "string" argument must be of type string. Received type number');
                    }
                    return allocUnsafe(e);
                }
                return from(e, r, t);
            }
            Buffer.poolSize = 8192;
            function from(e, r, t) {
                if (typeof e === "string") {
                    return fromString(e, r);
                }
                if (ArrayBuffer.isView(e)) {
                    return fromArrayLike(e);
                }
                if (e == null) {
                    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, " + "or Array-like Object. Received type " + typeof e);
                }
                if (isInstance(e, ArrayBuffer) || e && isInstance(e.buffer, ArrayBuffer)) {
                    return fromArrayBuffer(e, r, t);
                }
                if (typeof SharedArrayBuffer !== "undefined" && (isInstance(e, SharedArrayBuffer) || e && isInstance(e.buffer, SharedArrayBuffer))) {
                    return fromArrayBuffer(e, r, t);
                }
                if (typeof e === "number") {
                    throw new TypeError('The "value" argument must not be of type number. Received type number');
                }
                var f = e.valueOf && e.valueOf();
                if (f != null && f !== e) {
                    return Buffer.from(f, r, t);
                }
                var n = fromObject(e);
                if (n) return n;
                if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof e[Symbol.toPrimitive] === "function") {
                    return Buffer.from(e[Symbol.toPrimitive]("string"), r, t);
                }
                throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, " + "or Array-like Object. Received type " + typeof e);
            }
            Buffer.from = function(e, r, t) {
                return from(e, r, t);
            };
            Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
            Object.setPrototypeOf(Buffer, Uint8Array);
            function assertSize(e) {
                if (typeof e !== "number") {
                    throw new TypeError('"size" argument must be of type number');
                } else if (e < 0) {
                    throw new RangeError('The value "' + e + '" is invalid for option "size"');
                }
            }
            function alloc(e, r, t) {
                assertSize(e);
                if (e <= 0) {
                    return createBuffer(e);
                }
                if (r !== undefined) {
                    return typeof t === "string" ? createBuffer(e).fill(r, t) : createBuffer(e).fill(r);
                }
                return createBuffer(e);
            }
            Buffer.alloc = function(e, r, t) {
                return alloc(e, r, t);
            };
            function allocUnsafe(e) {
                assertSize(e);
                return createBuffer(e < 0 ? 0 : checked(e) | 0);
            }
            Buffer.allocUnsafe = function(e) {
                return allocUnsafe(e);
            };
            Buffer.allocUnsafeSlow = function(e) {
                return allocUnsafe(e);
            };
            function fromString(e, r) {
                if (typeof r !== "string" || r === "") {
                    r = "utf8";
                }
                if (!Buffer.isEncoding(r)) {
                    throw new TypeError("Unknown encoding: " + r);
                }
                var t = byteLength(e, r) | 0;
                var f = createBuffer(t);
                var n = f.write(e, r);
                if (n !== t) {
                    f = f.slice(0, n);
                }
                return f;
            }
            function fromArrayLike(e) {
                var r = e.length < 0 ? 0 : checked(e.length) | 0;
                var t = createBuffer(r);
                for(var f = 0; f < r; f += 1){
                    t[f] = e[f] & 255;
                }
                return t;
            }
            function fromArrayBuffer(e, r, t) {
                if (r < 0 || e.byteLength < r) {
                    throw new RangeError('"offset" is outside of buffer bounds');
                }
                if (e.byteLength < r + (t || 0)) {
                    throw new RangeError('"length" is outside of buffer bounds');
                }
                var f;
                if (r === undefined && t === undefined) {
                    f = new Uint8Array(e);
                } else if (t === undefined) {
                    f = new Uint8Array(e, r);
                } else {
                    f = new Uint8Array(e, r, t);
                }
                Object.setPrototypeOf(f, Buffer.prototype);
                return f;
            }
            function fromObject(e) {
                if (Buffer.isBuffer(e)) {
                    var r = checked(e.length) | 0;
                    var t = createBuffer(r);
                    if (t.length === 0) {
                        return t;
                    }
                    e.copy(t, 0, 0, r);
                    return t;
                }
                if (e.length !== undefined) {
                    if (typeof e.length !== "number" || numberIsNaN(e.length)) {
                        return createBuffer(0);
                    }
                    return fromArrayLike(e);
                }
                if (e.type === "Buffer" && Array.isArray(e.data)) {
                    return fromArrayLike(e.data);
                }
            }
            function checked(e) {
                if (e >= o) {
                    throw new RangeError("Attempt to allocate Buffer larger than maximum " + "size: 0x" + o.toString(16) + " bytes");
                }
                return e | 0;
            }
            function SlowBuffer(e) {
                if (+e != e) {
                    e = 0;
                }
                return Buffer.alloc(+e);
            }
            Buffer.isBuffer = function isBuffer(e) {
                return e != null && e._isBuffer === true && e !== Buffer.prototype;
            };
            Buffer.compare = function compare(e, r) {
                if (isInstance(e, Uint8Array)) e = Buffer.from(e, e.offset, e.byteLength);
                if (isInstance(r, Uint8Array)) r = Buffer.from(r, r.offset, r.byteLength);
                if (!Buffer.isBuffer(e) || !Buffer.isBuffer(r)) {
                    throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                }
                if (e === r) return 0;
                var t = e.length;
                var f = r.length;
                for(var n = 0, i = Math.min(t, f); n < i; ++n){
                    if (e[n] !== r[n]) {
                        t = e[n];
                        f = r[n];
                        break;
                    }
                }
                if (t < f) return -1;
                if (f < t) return 1;
                return 0;
            };
            Buffer.isEncoding = function isEncoding(e) {
                switch(String(e).toLowerCase()){
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "latin1":
                    case "binary":
                    case "base64":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return true;
                    default:
                        return false;
                }
            };
            Buffer.concat = function concat(e, r) {
                if (!Array.isArray(e)) {
                    throw new TypeError('"list" argument must be an Array of Buffers');
                }
                if (e.length === 0) {
                    return Buffer.alloc(0);
                }
                var t;
                if (r === undefined) {
                    r = 0;
                    for(t = 0; t < e.length; ++t){
                        r += e[t].length;
                    }
                }
                var f = Buffer.allocUnsafe(r);
                var n = 0;
                for(t = 0; t < e.length; ++t){
                    var i = e[t];
                    if (isInstance(i, Uint8Array)) {
                        i = Buffer.from(i);
                    }
                    if (!Buffer.isBuffer(i)) {
                        throw new TypeError('"list" argument must be an Array of Buffers');
                    }
                    i.copy(f, n);
                    n += i.length;
                }
                return f;
            };
            function byteLength(e, r) {
                if (Buffer.isBuffer(e)) {
                    return e.length;
                }
                if (ArrayBuffer.isView(e) || isInstance(e, ArrayBuffer)) {
                    return e.byteLength;
                }
                if (typeof e !== "string") {
                    throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' + "Received type " + typeof e);
                }
                var t = e.length;
                var f = arguments.length > 2 && arguments[2] === true;
                if (!f && t === 0) return 0;
                var n = false;
                for(;;){
                    switch(r){
                        case "ascii":
                        case "latin1":
                        case "binary":
                            return t;
                        case "utf8":
                        case "utf-8":
                            return utf8ToBytes(e).length;
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return t * 2;
                        case "hex":
                            return t >>> 1;
                        case "base64":
                            return base64ToBytes(e).length;
                        default:
                            if (n) {
                                return f ? -1 : utf8ToBytes(e).length;
                            }
                            r = ("" + r).toLowerCase();
                            n = true;
                    }
                }
            }
            Buffer.byteLength = byteLength;
            function slowToString(e, r, t) {
                var f = false;
                if (r === undefined || r < 0) {
                    r = 0;
                }
                if (r > this.length) {
                    return "";
                }
                if (t === undefined || t > this.length) {
                    t = this.length;
                }
                if (t <= 0) {
                    return "";
                }
                t >>>= 0;
                r >>>= 0;
                if (t <= r) {
                    return "";
                }
                if (!e) e = "utf8";
                while(true){
                    switch(e){
                        case "hex":
                            return hexSlice(this, r, t);
                        case "utf8":
                        case "utf-8":
                            return utf8Slice(this, r, t);
                        case "ascii":
                            return asciiSlice(this, r, t);
                        case "latin1":
                        case "binary":
                            return latin1Slice(this, r, t);
                        case "base64":
                            return base64Slice(this, r, t);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return utf16leSlice(this, r, t);
                        default:
                            if (f) throw new TypeError("Unknown encoding: " + e);
                            e = (e + "").toLowerCase();
                            f = true;
                    }
                }
            }
            Buffer.prototype._isBuffer = true;
            function swap(e, r, t) {
                var f = e[r];
                e[r] = e[t];
                e[t] = f;
            }
            Buffer.prototype.swap16 = function swap16() {
                var e = this.length;
                if (e % 2 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 16-bits");
                }
                for(var r = 0; r < e; r += 2){
                    swap(this, r, r + 1);
                }
                return this;
            };
            Buffer.prototype.swap32 = function swap32() {
                var e = this.length;
                if (e % 4 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 32-bits");
                }
                for(var r = 0; r < e; r += 4){
                    swap(this, r, r + 3);
                    swap(this, r + 1, r + 2);
                }
                return this;
            };
            Buffer.prototype.swap64 = function swap64() {
                var e = this.length;
                if (e % 8 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 64-bits");
                }
                for(var r = 0; r < e; r += 8){
                    swap(this, r, r + 7);
                    swap(this, r + 1, r + 6);
                    swap(this, r + 2, r + 5);
                    swap(this, r + 3, r + 4);
                }
                return this;
            };
            Buffer.prototype.toString = function toString() {
                var e = this.length;
                if (e === 0) return "";
                if (arguments.length === 0) return utf8Slice(this, 0, e);
                return slowToString.apply(this, arguments);
            };
            Buffer.prototype.toLocaleString = Buffer.prototype.toString;
            Buffer.prototype.equals = function equals(e) {
                if (!Buffer.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                if (this === e) return true;
                return Buffer.compare(this, e) === 0;
            };
            Buffer.prototype.inspect = function inspect() {
                var e = "";
                var t = r.INSPECT_MAX_BYTES;
                e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim();
                if (this.length > t) e += " ... ";
                return "<Buffer " + e + ">";
            };
            if (i) {
                Buffer.prototype[i] = Buffer.prototype.inspect;
            }
            Buffer.prototype.compare = function compare(e, r, t, f, n) {
                if (isInstance(e, Uint8Array)) {
                    e = Buffer.from(e, e.offset, e.byteLength);
                }
                if (!Buffer.isBuffer(e)) {
                    throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. ' + "Received type " + typeof e);
                }
                if (r === undefined) {
                    r = 0;
                }
                if (t === undefined) {
                    t = e ? e.length : 0;
                }
                if (f === undefined) {
                    f = 0;
                }
                if (n === undefined) {
                    n = this.length;
                }
                if (r < 0 || t > e.length || f < 0 || n > this.length) {
                    throw new RangeError("out of range index");
                }
                if (f >= n && r >= t) {
                    return 0;
                }
                if (f >= n) {
                    return -1;
                }
                if (r >= t) {
                    return 1;
                }
                r >>>= 0;
                t >>>= 0;
                f >>>= 0;
                n >>>= 0;
                if (this === e) return 0;
                var i = n - f;
                var o = t - r;
                var u = Math.min(i, o);
                var a = this.slice(f, n);
                var s = e.slice(r, t);
                for(var h = 0; h < u; ++h){
                    if (a[h] !== s[h]) {
                        i = a[h];
                        o = s[h];
                        break;
                    }
                }
                if (i < o) return -1;
                if (o < i) return 1;
                return 0;
            };
            function bidirectionalIndexOf(e, r, t, f, n) {
                if (e.length === 0) return -1;
                if (typeof t === "string") {
                    f = t;
                    t = 0;
                } else if (t > 2147483647) {
                    t = 2147483647;
                } else if (t < -2147483648) {
                    t = -2147483648;
                }
                t = +t;
                if (numberIsNaN(t)) {
                    t = n ? 0 : e.length - 1;
                }
                if (t < 0) t = e.length + t;
                if (t >= e.length) {
                    if (n) return -1;
                    else t = e.length - 1;
                } else if (t < 0) {
                    if (n) t = 0;
                    else return -1;
                }
                if (typeof r === "string") {
                    r = Buffer.from(r, f);
                }
                if (Buffer.isBuffer(r)) {
                    if (r.length === 0) {
                        return -1;
                    }
                    return arrayIndexOf(e, r, t, f, n);
                } else if (typeof r === "number") {
                    r = r & 255;
                    if (typeof Uint8Array.prototype.indexOf === "function") {
                        if (n) {
                            return Uint8Array.prototype.indexOf.call(e, r, t);
                        } else {
                            return Uint8Array.prototype.lastIndexOf.call(e, r, t);
                        }
                    }
                    return arrayIndexOf(e, [
                        r
                    ], t, f, n);
                }
                throw new TypeError("val must be string, number or Buffer");
            }
            function arrayIndexOf(e, r, t, f, n) {
                var i = 1;
                var o = e.length;
                var u = r.length;
                if (f !== undefined) {
                    f = String(f).toLowerCase();
                    if (f === "ucs2" || f === "ucs-2" || f === "utf16le" || f === "utf-16le") {
                        if (e.length < 2 || r.length < 2) {
                            return -1;
                        }
                        i = 2;
                        o /= 2;
                        u /= 2;
                        t /= 2;
                    }
                }
                function read(e, r) {
                    if (i === 1) {
                        return e[r];
                    } else {
                        return e.readUInt16BE(r * i);
                    }
                }
                var a;
                if (n) {
                    var s = -1;
                    for(a = t; a < o; a++){
                        if (read(e, a) === read(r, s === -1 ? 0 : a - s)) {
                            if (s === -1) s = a;
                            if (a - s + 1 === u) return s * i;
                        } else {
                            if (s !== -1) a -= a - s;
                            s = -1;
                        }
                    }
                } else {
                    if (t + u > o) t = o - u;
                    for(a = t; a >= 0; a--){
                        var h = true;
                        for(var c = 0; c < u; c++){
                            if (read(e, a + c) !== read(r, c)) {
                                h = false;
                                break;
                            }
                        }
                        if (h) return a;
                    }
                }
                return -1;
            }
            Buffer.prototype.includes = function includes(e, r, t) {
                return this.indexOf(e, r, t) !== -1;
            };
            Buffer.prototype.indexOf = function indexOf(e, r, t) {
                return bidirectionalIndexOf(this, e, r, t, true);
            };
            Buffer.prototype.lastIndexOf = function lastIndexOf(e, r, t) {
                return bidirectionalIndexOf(this, e, r, t, false);
            };
            function hexWrite(e, r, t, f) {
                t = Number(t) || 0;
                var n = e.length - t;
                if (!f) {
                    f = n;
                } else {
                    f = Number(f);
                    if (f > n) {
                        f = n;
                    }
                }
                var i = r.length;
                if (f > i / 2) {
                    f = i / 2;
                }
                for(var o = 0; o < f; ++o){
                    var u = parseInt(r.substr(o * 2, 2), 16);
                    if (numberIsNaN(u)) return o;
                    e[t + o] = u;
                }
                return o;
            }
            function utf8Write(e, r, t, f) {
                return blitBuffer(utf8ToBytes(r, e.length - t), e, t, f);
            }
            function asciiWrite(e, r, t, f) {
                return blitBuffer(asciiToBytes(r), e, t, f);
            }
            function latin1Write(e, r, t, f) {
                return asciiWrite(e, r, t, f);
            }
            function base64Write(e, r, t, f) {
                return blitBuffer(base64ToBytes(r), e, t, f);
            }
            function ucs2Write(e, r, t, f) {
                return blitBuffer(utf16leToBytes(r, e.length - t), e, t, f);
            }
            Buffer.prototype.write = function write(e, r, t, f) {
                if (r === undefined) {
                    f = "utf8";
                    t = this.length;
                    r = 0;
                } else if (t === undefined && typeof r === "string") {
                    f = r;
                    t = this.length;
                    r = 0;
                } else if (isFinite(r)) {
                    r = r >>> 0;
                    if (isFinite(t)) {
                        t = t >>> 0;
                        if (f === undefined) f = "utf8";
                    } else {
                        f = t;
                        t = undefined;
                    }
                } else {
                    throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                }
                var n = this.length - r;
                if (t === undefined || t > n) t = n;
                if (e.length > 0 && (t < 0 || r < 0) || r > this.length) {
                    throw new RangeError("Attempt to write outside buffer bounds");
                }
                if (!f) f = "utf8";
                var i = false;
                for(;;){
                    switch(f){
                        case "hex":
                            return hexWrite(this, e, r, t);
                        case "utf8":
                        case "utf-8":
                            return utf8Write(this, e, r, t);
                        case "ascii":
                            return asciiWrite(this, e, r, t);
                        case "latin1":
                        case "binary":
                            return latin1Write(this, e, r, t);
                        case "base64":
                            return base64Write(this, e, r, t);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return ucs2Write(this, e, r, t);
                        default:
                            if (i) throw new TypeError("Unknown encoding: " + f);
                            f = ("" + f).toLowerCase();
                            i = true;
                    }
                }
            };
            Buffer.prototype.toJSON = function toJSON() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                };
            };
            function base64Slice(e, r, t) {
                if (r === 0 && t === e.length) {
                    return f.fromByteArray(e);
                } else {
                    return f.fromByteArray(e.slice(r, t));
                }
            }
            function utf8Slice(e, r, t) {
                t = Math.min(e.length, t);
                var f = [];
                var n = r;
                while(n < t){
                    var i = e[n];
                    var o = null;
                    var u = i > 239 ? 4 : i > 223 ? 3 : i > 191 ? 2 : 1;
                    if (n + u <= t) {
                        var a, s, h, c;
                        switch(u){
                            case 1:
                                if (i < 128) {
                                    o = i;
                                }
                                break;
                            case 2:
                                a = e[n + 1];
                                if ((a & 192) === 128) {
                                    c = (i & 31) << 6 | a & 63;
                                    if (c > 127) {
                                        o = c;
                                    }
                                }
                                break;
                            case 3:
                                a = e[n + 1];
                                s = e[n + 2];
                                if ((a & 192) === 128 && (s & 192) === 128) {
                                    c = (i & 15) << 12 | (a & 63) << 6 | s & 63;
                                    if (c > 2047 && (c < 55296 || c > 57343)) {
                                        o = c;
                                    }
                                }
                                break;
                            case 4:
                                a = e[n + 1];
                                s = e[n + 2];
                                h = e[n + 3];
                                if ((a & 192) === 128 && (s & 192) === 128 && (h & 192) === 128) {
                                    c = (i & 15) << 18 | (a & 63) << 12 | (s & 63) << 6 | h & 63;
                                    if (c > 65535 && c < 1114112) {
                                        o = c;
                                    }
                                }
                        }
                    }
                    if (o === null) {
                        o = 65533;
                        u = 1;
                    } else if (o > 65535) {
                        o -= 65536;
                        f.push(o >>> 10 & 1023 | 55296);
                        o = 56320 | o & 1023;
                    }
                    f.push(o);
                    n += u;
                }
                return decodeCodePointsArray(f);
            }
            var u = 4096;
            function decodeCodePointsArray(e) {
                var r = e.length;
                if (r <= u) {
                    return String.fromCharCode.apply(String, e);
                }
                var t = "";
                var f = 0;
                while(f < r){
                    t += String.fromCharCode.apply(String, e.slice(f, f += u));
                }
                return t;
            }
            function asciiSlice(e, r, t) {
                var f = "";
                t = Math.min(e.length, t);
                for(var n = r; n < t; ++n){
                    f += String.fromCharCode(e[n] & 127);
                }
                return f;
            }
            function latin1Slice(e, r, t) {
                var f = "";
                t = Math.min(e.length, t);
                for(var n = r; n < t; ++n){
                    f += String.fromCharCode(e[n]);
                }
                return f;
            }
            function hexSlice(e, r, t) {
                var f = e.length;
                if (!r || r < 0) r = 0;
                if (!t || t < 0 || t > f) t = f;
                var n = "";
                for(var i = r; i < t; ++i){
                    n += s[e[i]];
                }
                return n;
            }
            function utf16leSlice(e, r, t) {
                var f = e.slice(r, t);
                var n = "";
                for(var i = 0; i < f.length; i += 2){
                    n += String.fromCharCode(f[i] + f[i + 1] * 256);
                }
                return n;
            }
            Buffer.prototype.slice = function slice(e, r) {
                var t = this.length;
                e = ~~e;
                r = r === undefined ? t : ~~r;
                if (e < 0) {
                    e += t;
                    if (e < 0) e = 0;
                } else if (e > t) {
                    e = t;
                }
                if (r < 0) {
                    r += t;
                    if (r < 0) r = 0;
                } else if (r > t) {
                    r = t;
                }
                if (r < e) r = e;
                var f = this.subarray(e, r);
                Object.setPrototypeOf(f, Buffer.prototype);
                return f;
            };
            function checkOffset(e, r, t) {
                if (e % 1 !== 0 || e < 0) throw new RangeError("offset is not uint");
                if (e + r > t) throw new RangeError("Trying to access beyond buffer length");
            }
            Buffer.prototype.readUIntLE = function readUIntLE(e, r, t) {
                e = e >>> 0;
                r = r >>> 0;
                if (!t) checkOffset(e, r, this.length);
                var f = this[e];
                var n = 1;
                var i = 0;
                while(++i < r && (n *= 256)){
                    f += this[e + i] * n;
                }
                return f;
            };
            Buffer.prototype.readUIntBE = function readUIntBE(e, r, t) {
                e = e >>> 0;
                r = r >>> 0;
                if (!t) {
                    checkOffset(e, r, this.length);
                }
                var f = this[e + --r];
                var n = 1;
                while(r > 0 && (n *= 256)){
                    f += this[e + --r] * n;
                }
                return f;
            };
            Buffer.prototype.readUInt8 = function readUInt8(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 1, this.length);
                return this[e];
            };
            Buffer.prototype.readUInt16LE = function readUInt16LE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 2, this.length);
                return this[e] | this[e + 1] << 8;
            };
            Buffer.prototype.readUInt16BE = function readUInt16BE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 2, this.length);
                return this[e] << 8 | this[e + 1];
            };
            Buffer.prototype.readUInt32LE = function readUInt32LE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + this[e + 3] * 16777216;
            };
            Buffer.prototype.readUInt32BE = function readUInt32BE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return this[e] * 16777216 + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
            };
            Buffer.prototype.readIntLE = function readIntLE(e, r, t) {
                e = e >>> 0;
                r = r >>> 0;
                if (!t) checkOffset(e, r, this.length);
                var f = this[e];
                var n = 1;
                var i = 0;
                while(++i < r && (n *= 256)){
                    f += this[e + i] * n;
                }
                n *= 128;
                if (f >= n) f -= Math.pow(2, 8 * r);
                return f;
            };
            Buffer.prototype.readIntBE = function readIntBE(e, r, t) {
                e = e >>> 0;
                r = r >>> 0;
                if (!t) checkOffset(e, r, this.length);
                var f = r;
                var n = 1;
                var i = this[e + --f];
                while(f > 0 && (n *= 256)){
                    i += this[e + --f] * n;
                }
                n *= 128;
                if (i >= n) i -= Math.pow(2, 8 * r);
                return i;
            };
            Buffer.prototype.readInt8 = function readInt8(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 1, this.length);
                if (!(this[e] & 128)) return this[e];
                return (255 - this[e] + 1) * -1;
            };
            Buffer.prototype.readInt16LE = function readInt16LE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 2, this.length);
                var t = this[e] | this[e + 1] << 8;
                return t & 32768 ? t | 4294901760 : t;
            };
            Buffer.prototype.readInt16BE = function readInt16BE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 2, this.length);
                var t = this[e + 1] | this[e] << 8;
                return t & 32768 ? t | 4294901760 : t;
            };
            Buffer.prototype.readInt32LE = function readInt32LE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
            };
            Buffer.prototype.readInt32BE = function readInt32BE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
            };
            Buffer.prototype.readFloatLE = function readFloatLE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return n.read(this, e, true, 23, 4);
            };
            Buffer.prototype.readFloatBE = function readFloatBE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return n.read(this, e, false, 23, 4);
            };
            Buffer.prototype.readDoubleLE = function readDoubleLE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 8, this.length);
                return n.read(this, e, true, 52, 8);
            };
            Buffer.prototype.readDoubleBE = function readDoubleBE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 8, this.length);
                return n.read(this, e, false, 52, 8);
            };
            function checkInt(e, r, t, f, n, i) {
                if (!Buffer.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
                if (r > n || r < i) throw new RangeError('"value" argument is out of bounds');
                if (t + f > e.length) throw new RangeError("Index out of range");
            }
            Buffer.prototype.writeUIntLE = function writeUIntLE(e, r, t, f) {
                e = +e;
                r = r >>> 0;
                t = t >>> 0;
                if (!f) {
                    var n = Math.pow(2, 8 * t) - 1;
                    checkInt(this, e, r, t, n, 0);
                }
                var i = 1;
                var o = 0;
                this[r] = e & 255;
                while(++o < t && (i *= 256)){
                    this[r + o] = e / i & 255;
                }
                return r + t;
            };
            Buffer.prototype.writeUIntBE = function writeUIntBE(e, r, t, f) {
                e = +e;
                r = r >>> 0;
                t = t >>> 0;
                if (!f) {
                    var n = Math.pow(2, 8 * t) - 1;
                    checkInt(this, e, r, t, n, 0);
                }
                var i = t - 1;
                var o = 1;
                this[r + i] = e & 255;
                while(--i >= 0 && (o *= 256)){
                    this[r + i] = e / o & 255;
                }
                return r + t;
            };
            Buffer.prototype.writeUInt8 = function writeUInt8(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 1, 255, 0);
                this[r] = e & 255;
                return r + 1;
            };
            Buffer.prototype.writeUInt16LE = function writeUInt16LE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 2, 65535, 0);
                this[r] = e & 255;
                this[r + 1] = e >>> 8;
                return r + 2;
            };
            Buffer.prototype.writeUInt16BE = function writeUInt16BE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 2, 65535, 0);
                this[r] = e >>> 8;
                this[r + 1] = e & 255;
                return r + 2;
            };
            Buffer.prototype.writeUInt32LE = function writeUInt32LE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 4, 4294967295, 0);
                this[r + 3] = e >>> 24;
                this[r + 2] = e >>> 16;
                this[r + 1] = e >>> 8;
                this[r] = e & 255;
                return r + 4;
            };
            Buffer.prototype.writeUInt32BE = function writeUInt32BE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 4, 4294967295, 0);
                this[r] = e >>> 24;
                this[r + 1] = e >>> 16;
                this[r + 2] = e >>> 8;
                this[r + 3] = e & 255;
                return r + 4;
            };
            Buffer.prototype.writeIntLE = function writeIntLE(e, r, t, f) {
                e = +e;
                r = r >>> 0;
                if (!f) {
                    var n = Math.pow(2, 8 * t - 1);
                    checkInt(this, e, r, t, n - 1, -n);
                }
                var i = 0;
                var o = 1;
                var u = 0;
                this[r] = e & 255;
                while(++i < t && (o *= 256)){
                    if (e < 0 && u === 0 && this[r + i - 1] !== 0) {
                        u = 1;
                    }
                    this[r + i] = (e / o >> 0) - u & 255;
                }
                return r + t;
            };
            Buffer.prototype.writeIntBE = function writeIntBE(e, r, t, f) {
                e = +e;
                r = r >>> 0;
                if (!f) {
                    var n = Math.pow(2, 8 * t - 1);
                    checkInt(this, e, r, t, n - 1, -n);
                }
                var i = t - 1;
                var o = 1;
                var u = 0;
                this[r + i] = e & 255;
                while(--i >= 0 && (o *= 256)){
                    if (e < 0 && u === 0 && this[r + i + 1] !== 0) {
                        u = 1;
                    }
                    this[r + i] = (e / o >> 0) - u & 255;
                }
                return r + t;
            };
            Buffer.prototype.writeInt8 = function writeInt8(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 1, 127, -128);
                if (e < 0) e = 255 + e + 1;
                this[r] = e & 255;
                return r + 1;
            };
            Buffer.prototype.writeInt16LE = function writeInt16LE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 2, 32767, -32768);
                this[r] = e & 255;
                this[r + 1] = e >>> 8;
                return r + 2;
            };
            Buffer.prototype.writeInt16BE = function writeInt16BE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 2, 32767, -32768);
                this[r] = e >>> 8;
                this[r + 1] = e & 255;
                return r + 2;
            };
            Buffer.prototype.writeInt32LE = function writeInt32LE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 4, 2147483647, -2147483648);
                this[r] = e & 255;
                this[r + 1] = e >>> 8;
                this[r + 2] = e >>> 16;
                this[r + 3] = e >>> 24;
                return r + 4;
            };
            Buffer.prototype.writeInt32BE = function writeInt32BE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 4, 2147483647, -2147483648);
                if (e < 0) e = 4294967295 + e + 1;
                this[r] = e >>> 24;
                this[r + 1] = e >>> 16;
                this[r + 2] = e >>> 8;
                this[r + 3] = e & 255;
                return r + 4;
            };
            function checkIEEE754(e, r, t, f, n, i) {
                if (t + f > e.length) throw new RangeError("Index out of range");
                if (t < 0) throw new RangeError("Index out of range");
            }
            function writeFloat(e, r, t, f, i) {
                r = +r;
                t = t >>> 0;
                if (!i) {
                    checkIEEE754(e, r, t, 4, 34028234663852886e22, -34028234663852886e22);
                }
                n.write(e, r, t, f, 23, 4);
                return t + 4;
            }
            Buffer.prototype.writeFloatLE = function writeFloatLE(e, r, t) {
                return writeFloat(this, e, r, true, t);
            };
            Buffer.prototype.writeFloatBE = function writeFloatBE(e, r, t) {
                return writeFloat(this, e, r, false, t);
            };
            function writeDouble(e, r, t, f, i) {
                r = +r;
                t = t >>> 0;
                if (!i) {
                    checkIEEE754(e, r, t, 8, 17976931348623157e292, -17976931348623157e292);
                }
                n.write(e, r, t, f, 52, 8);
                return t + 8;
            }
            Buffer.prototype.writeDoubleLE = function writeDoubleLE(e, r, t) {
                return writeDouble(this, e, r, true, t);
            };
            Buffer.prototype.writeDoubleBE = function writeDoubleBE(e, r, t) {
                return writeDouble(this, e, r, false, t);
            };
            Buffer.prototype.copy = function copy(e, r, t, f) {
                if (!Buffer.isBuffer(e)) throw new TypeError("argument should be a Buffer");
                if (!t) t = 0;
                if (!f && f !== 0) f = this.length;
                if (r >= e.length) r = e.length;
                if (!r) r = 0;
                if (f > 0 && f < t) f = t;
                if (f === t) return 0;
                if (e.length === 0 || this.length === 0) return 0;
                if (r < 0) {
                    throw new RangeError("targetStart out of bounds");
                }
                if (t < 0 || t >= this.length) throw new RangeError("Index out of range");
                if (f < 0) throw new RangeError("sourceEnd out of bounds");
                if (f > this.length) f = this.length;
                if (e.length - r < f - t) {
                    f = e.length - r + t;
                }
                var n = f - t;
                if (this === e && typeof Uint8Array.prototype.copyWithin === "function") {
                    this.copyWithin(r, t, f);
                } else if (this === e && t < r && r < f) {
                    for(var i = n - 1; i >= 0; --i){
                        e[i + r] = this[i + t];
                    }
                } else {
                    Uint8Array.prototype.set.call(e, this.subarray(t, f), r);
                }
                return n;
            };
            Buffer.prototype.fill = function fill(e, r, t, f) {
                if (typeof e === "string") {
                    if (typeof r === "string") {
                        f = r;
                        r = 0;
                        t = this.length;
                    } else if (typeof t === "string") {
                        f = t;
                        t = this.length;
                    }
                    if (f !== undefined && typeof f !== "string") {
                        throw new TypeError("encoding must be a string");
                    }
                    if (typeof f === "string" && !Buffer.isEncoding(f)) {
                        throw new TypeError("Unknown encoding: " + f);
                    }
                    if (e.length === 1) {
                        var n = e.charCodeAt(0);
                        if (f === "utf8" && n < 128 || f === "latin1") {
                            e = n;
                        }
                    }
                } else if (typeof e === "number") {
                    e = e & 255;
                } else if (typeof e === "boolean") {
                    e = Number(e);
                }
                if (r < 0 || this.length < r || this.length < t) {
                    throw new RangeError("Out of range index");
                }
                if (t <= r) {
                    return this;
                }
                r = r >>> 0;
                t = t === undefined ? this.length : t >>> 0;
                if (!e) e = 0;
                var i;
                if (typeof e === "number") {
                    for(i = r; i < t; ++i){
                        this[i] = e;
                    }
                } else {
                    var o = Buffer.isBuffer(e) ? e : Buffer.from(e, f);
                    var u = o.length;
                    if (u === 0) {
                        throw new TypeError('The value "' + e + '" is invalid for argument "value"');
                    }
                    for(i = 0; i < t - r; ++i){
                        this[i + r] = o[i % u];
                    }
                }
                return this;
            };
            var a = /[^+/0-9A-Za-z-_]/g;
            function base64clean(e) {
                e = e.split("=")[0];
                e = e.trim().replace(a, "");
                if (e.length < 2) return "";
                while(e.length % 4 !== 0){
                    e = e + "=";
                }
                return e;
            }
            function utf8ToBytes(e, r) {
                r = r || Infinity;
                var t;
                var f = e.length;
                var n = null;
                var i = [];
                for(var o = 0; o < f; ++o){
                    t = e.charCodeAt(o);
                    if (t > 55295 && t < 57344) {
                        if (!n) {
                            if (t > 56319) {
                                if ((r -= 3) > -1) i.push(239, 191, 189);
                                continue;
                            } else if (o + 1 === f) {
                                if ((r -= 3) > -1) i.push(239, 191, 189);
                                continue;
                            }
                            n = t;
                            continue;
                        }
                        if (t < 56320) {
                            if ((r -= 3) > -1) i.push(239, 191, 189);
                            n = t;
                            continue;
                        }
                        t = (n - 55296 << 10 | t - 56320) + 65536;
                    } else if (n) {
                        if ((r -= 3) > -1) i.push(239, 191, 189);
                    }
                    n = null;
                    if (t < 128) {
                        if ((r -= 1) < 0) break;
                        i.push(t);
                    } else if (t < 2048) {
                        if ((r -= 2) < 0) break;
                        i.push(t >> 6 | 192, t & 63 | 128);
                    } else if (t < 65536) {
                        if ((r -= 3) < 0) break;
                        i.push(t >> 12 | 224, t >> 6 & 63 | 128, t & 63 | 128);
                    } else if (t < 1114112) {
                        if ((r -= 4) < 0) break;
                        i.push(t >> 18 | 240, t >> 12 & 63 | 128, t >> 6 & 63 | 128, t & 63 | 128);
                    } else {
                        throw new Error("Invalid code point");
                    }
                }
                return i;
            }
            function asciiToBytes(e) {
                var r = [];
                for(var t = 0; t < e.length; ++t){
                    r.push(e.charCodeAt(t) & 255);
                }
                return r;
            }
            function utf16leToBytes(e, r) {
                var t, f, n;
                var i = [];
                for(var o = 0; o < e.length; ++o){
                    if ((r -= 2) < 0) break;
                    t = e.charCodeAt(o);
                    f = t >> 8;
                    n = t % 256;
                    i.push(n);
                    i.push(f);
                }
                return i;
            }
            function base64ToBytes(e) {
                return f.toByteArray(base64clean(e));
            }
            function blitBuffer(e, r, t, f) {
                for(var n = 0; n < f; ++n){
                    if (n + t >= r.length || n >= e.length) break;
                    r[n + t] = e[n];
                }
                return n;
            }
            function isInstance(e, r) {
                return e instanceof r || e != null && e.constructor != null && e.constructor.name != null && e.constructor.name === r.name;
            }
            function numberIsNaN(e) {
                return e !== e;
            }
            var s = function() {
                var e = "0123456789abcdef";
                var r = new Array(256);
                for(var t = 0; t < 16; ++t){
                    var f = t * 16;
                    for(var n = 0; n < 16; ++n){
                        r[f + n] = e[t] + e[n];
                    }
                }
                return r;
            }();
        },
        783: function(e, r) {
            /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */ r.read = function(e, r, t, f, n) {
                var i, o;
                var u = n * 8 - f - 1;
                var a = (1 << u) - 1;
                var s = a >> 1;
                var h = -7;
                var c = t ? n - 1 : 0;
                var l = t ? -1 : 1;
                var p = e[r + c];
                c += l;
                i = p & (1 << -h) - 1;
                p >>= -h;
                h += u;
                for(; h > 0; i = i * 256 + e[r + c], c += l, h -= 8){}
                o = i & (1 << -h) - 1;
                i >>= -h;
                h += f;
                for(; h > 0; o = o * 256 + e[r + c], c += l, h -= 8){}
                if (i === 0) {
                    i = 1 - s;
                } else if (i === a) {
                    return o ? NaN : (p ? -1 : 1) * Infinity;
                } else {
                    o = o + Math.pow(2, f);
                    i = i - s;
                }
                return (p ? -1 : 1) * o * Math.pow(2, i - f);
            };
            r.write = function(e, r, t, f, n, i) {
                var o, u, a;
                var s = i * 8 - n - 1;
                var h = (1 << s) - 1;
                var c = h >> 1;
                var l = n === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
                var p = f ? 0 : i - 1;
                var y = f ? 1 : -1;
                var g = r < 0 || r === 0 && 1 / r < 0 ? 1 : 0;
                r = Math.abs(r);
                if (isNaN(r) || r === Infinity) {
                    u = isNaN(r) ? 1 : 0;
                    o = h;
                } else {
                    o = Math.floor(Math.log(r) / Math.LN2);
                    if (r * (a = Math.pow(2, -o)) < 1) {
                        o--;
                        a *= 2;
                    }
                    if (o + c >= 1) {
                        r += l / a;
                    } else {
                        r += l * Math.pow(2, 1 - c);
                    }
                    if (r * a >= 2) {
                        o++;
                        a /= 2;
                    }
                    if (o + c >= h) {
                        u = 0;
                        o = h;
                    } else if (o + c >= 1) {
                        u = (r * a - 1) * Math.pow(2, n);
                        o = o + c;
                    } else {
                        u = r * Math.pow(2, c - 1) * Math.pow(2, n);
                        o = 0;
                    }
                }
                for(; n >= 8; e[t + p] = u & 255, p += y, u /= 256, n -= 8){}
                o = o << n | u;
                s += n;
                for(; s > 0; e[t + p] = o & 255, p += y, o /= 256, s -= 8){}
                e[t + p - y] |= g * 128;
            };
        }
    };
    var r = {};
    function __nccwpck_require__(t) {
        var f = r[t];
        if (f !== undefined) {
            return f.exports;
        }
        var n = r[t] = {
            exports: {}
        };
        var i = true;
        try {
            e[t](n, n.exports, __nccwpck_require__);
            i = false;
        } finally{
            if (i) delete r[t];
        }
        return n.exports;
    }
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = ("TURBOPACK compile-time value", "/ROOT/examples/web/node_modules/next/dist/compiled/buffer") + "/";
    var t = __nccwpck_require__(72);
    module.exports = t;
})();
}),
"[project]/examples/web/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "_",
    ()=>_define_property
]);
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else obj[key] = value;
    return obj;
}
;
}),
]);

//# sourceMappingURL=_05a0c372._.js.map
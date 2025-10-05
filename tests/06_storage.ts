import { SonyCamera } from "@camera/sony-camera";
import { Logger } from "@core/logger";
import { USBTransport } from "@transport/usb";

const logger = new Logger()
const transport = new USBTransport(logger)
const camera = new SonyCamera(transport, logger)

async function main() {
    await camera.connect()
    const storageIDs = await camera.getStorageIDs()
    console.log(storageIDs)
}

main()
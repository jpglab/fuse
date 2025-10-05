We want to build a TypeScript system that allows communication to devices PTP (Picture Transfer Protocol) and USB Still Image Capture Device class devices. We have already implemented the USB transport protocol which corresponds to levels 1, 2, 3, 4 (physical, data link, network, transport) in the OSI basic reference model (`src/transport/interfaces/transport.interface.ts`, `src/transport/interfaces/transport-types.ts`, `src/transport/interfaces/endpoint.ts`). We have also implemented USB device descovery which corresponds to level 4, 5 (transport, session) in the OSI basic reference model (`src/transport/interfaces/device-finder.interface.ts`). Now we are implementing the core PTP protocol which corresponds to levels 5, 6 (session, presentation) in the OSI basic reference model.

The absolutely crucial piece of this project is the definition of constants and objects which will facilitiate the transfer of data to/from a camera. There are 7 important types of **Constants** we care deeply about:

**Constants**

- **Datatype**
    - Can be a simple type like INT8, INT16, INT32, an array of simple types, or a custom dataset (an object) pertaining to a specific operation/property
    - Has a name, description, requires a codec
    - You should refer to Section 5 (titled "Data Format Specification") as well as Section 6 (titled "Image and data object formats") in the documentation
- **Parameter**
    - Has a name, description, requires a codec
- **Operation**
    - Has a code, name, description, up to 5 operation parameters, up to 5 response parameters, a data direction, optionally data
    - You should refer to Section 10 (titled "Operations") as well as Section 9 (titled "Communication Protocol"), and for any storage-related operations, Section 8 (titled "Persistent Storage") in the documentation
- **Property**
    - Has a code, name, description, a read-only or read/write flag (referred to as Get/Set/GetSet in the documentation), a datatype, optionally a default value, optionally a current value, and a codec (referred to as Form/Form Flag in the documentation)
    - You should refer to Section 13 (titled "Device Properties") in the documentation as well as Section 5 (titled "Data Format Specification") as well as Section 6 (titled "Image and data object formats") in the documentation
- **Codec**
    - Can be defined as either an **Enum** (key-value map, each value with a name and description, defined once and used in either direction), a **Range** with minimum, maximum, step, or a custom encode/decode function pair. Only one of these forms at a time
    - We should have standard encoders for INT8, INT16, etc. as well as any datasets mentioned
- **Response**
    - Has a code, name, description
    - You should refer to Section 11 (titled "Responses") as well as Section 9 (titled "Communication Protocol")
- **Event**
    - Has a code, name, description, sessionId, transactionId, and up to 5 parameters
    - Uses the interrupt endpoint for USB (may require extending the USB transport protocol)
    - You should refer to Section 12 (titled "Events") as well as Section 9 (titled "Communication Protocol")

For each type of **Constant**:
- The type definition of the constant should live in its own file, titled `<constant name>.ts`
- The definition of entities representing that constant should live in its own file, titled `<constant name>-definitions.ts` which exports a list of possible values
    - Each vendor will have their own overrides for each constant type – any vendor operations/properties with the same name should take precedence over the default PTP definitions. Do not define ANY vendor overrides at this time but put a stub in `vendors/<constant name>-definitions.ts` for each constant type
- Non-standard codecs definitions and non-standard parameter definitions should be inline unless they are used in more than one place

For the protocol level:
- `connect` (claims interface, opens connection/session)
- `disconnect` (closes session/connection, releases interface)
- `send` (takes an operation name and any parameters)
- `get` (gets a property name and decodes it)
- `set` (encodes a value and sets property name)
- `on` (handles any events)

Between our type definitions, constants, and protocol level, everything should be type-safe such that a consumer can't pass in a bad operation/property or malformed/missing/extraneous parameters. The functions should support Intellisense for names and parameters. Put all the new code relating to constants and protocol in `src/ptp`. 

Read `AGENTS.md` in full before continuing. The documentation and related images can be found in `./ptp_iso_15740_reference`

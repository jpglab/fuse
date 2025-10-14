# PTP Protocol Implementation

A type-safe Picture Transfer Protocol (PTP) implementation with automatic type inference from definitions.

## Architecture

This implementation achieves **true single-source-of-truth** - all protocol knowledge comes from the definition files, with zero duplication.

### Key Features

1. **Automatic Type Inference** - Types are extracted directly from definitions using TypeScript's conditional types
2. **Zero Manual Overloads** - No function overloads are manually written
3. **Single Generic Methods** - One method per operation type (`send`, `get`, `set`, `on`)
4. **Compile-Time Type Safety** - Full type checking at build time

## Usage

```typescript
import { PTPProtocol } from './ptp'

const protocol = new PTPProtocol(transport)

// Connect to device
await protocol.connect()

// Operations - parameters automatically inferred
await protocol.send('GetDeviceInfo') // No params
await protocol.send('GetStorageInfo', 0x10001) // Required param
await protocol.send('InitiateCapture') // Optional params
await protocol.send('MoveObject', 1, 2, 3) // Multiple params

// Properties - types automatically inferred
const battery: number = await protocol.get('BatteryLevel')
const artist: string = await protocol.get('Artist')
await protocol.set('ExposureTime', 1000) // number required
await protocol.set('Artist', 'John Doe') // string required

// Events
protocol.on('CaptureComplete', event => {
    console.log('Capture complete!')
})

// Disconnect
await protocol.disconnect()
```

## Type Safety

All invalid usage is caught at compile time:

```typescript
// ❌ These cause TypeScript compile errors:
await protocol.send('InvalidOperation') // Invalid name
await protocol.send('GetStorageInfo') // Missing param
await protocol.send('GetDeviceInfo', 123) // Too many params
await protocol.set('ExposureTime', 'not-number') // Wrong type
await protocol.get('InvalidProperty') // Invalid property
protocol.on('InvalidEvent', () => {}) // Invalid event
```

## Extending the Protocol

To add new operations, properties, or events, simply add them to the appropriate definition file:

### Adding an Operation

Edit `operation-definitions.ts`:

```typescript
export const operationDefinitions = [
    // ... existing operations
    {
        code: 0x1234,
        name: 'MyNewOperation',
        description: 'Description here',
        dataDirection: 'none',
        operationParameters: [
            {
                name: 'param1',
                description: 'First parameter',
                codec: baseCodecs.uint32,
                required: true,
            },
        ],
        responseParameters: [],
    },
] as const satisfies readonly OperationDefinition[]
```

The operation is immediately available with full type safety:

```typescript
await protocol.send('MyNewOperation', 12345) // ✅ Type-safe!
```

### Adding a Property

Edit `property-definitions.ts`:

```typescript
export const propertyDefinitions = [
    // ... existing properties
    {
        code: 0x5100,
        name: 'MyProperty',
        description: 'My custom property',
        datatype: UINT32,
        access: 'GetSet',
        codec: baseCodecs.uint32,
    },
] as const satisfies readonly PropertyDefinition[]
```

### Adding an Event

Edit `event-definitions.ts`:

```typescript
export const eventDefinitions = [
    // ... existing events
    {
        code: 0x4100,
        name: 'MyEvent',
        description: 'My custom event',
        parameters: [
            {
                name: 'EventData',
                description: 'Event data',
                type: 'UINT32',
            },
        ],
    },
] as const satisfies readonly EventDefinition[]
```

## Files Structure

```
src/ptp/
├── protocol.ts          # Main protocol implementation with automatic type inference
├── test-protocol.ts     # Type safety tests with @ts-expect-error comments
├── example-usage.ts     # Real-world usage examples
├── constants/           # All protocol constants (single source of truth)
│   ├── datatype-definitions.ts
│   ├── operation-definitions.ts
│   ├── property-definitions.ts
│   ├── event-definitions.ts
│   ├── response-definitions.ts
│   └── index.ts
├── types/              # Core type definitions and codecs
│   ├── codec.ts        # Encoding/decoding system
│   ├── codec-types.ts  # Type inference helpers
│   ├── datatype.ts     # Datatype interface
│   ├── operation.ts    # Operation interface
│   ├── property.ts     # Property interface
│   ├── event.ts        # Event interface
│   ├── response.ts     # Response interface
│   ├── parameter.ts    # Parameter interface
│   └── index.ts
└── vendors/            # Vendor-specific extensions
    ├── datatype-definitions.ts
    ├── operation-definitions.ts
    ├── property-definitions.ts
    ├── event-definitions.ts
    └── response-definitions.ts
```

## How It Works

The implementation uses advanced TypeScript features to extract types from definitions:

1. **Const Assertions** - `as const` makes TypeScript treat arrays as tuples with literal types
2. **Conditional Types** - Extract parameter types based on codec definitions
3. **Type Inference** - TypeScript infers function signatures from the definitions
4. **Generic Constraints** - Ensure only valid names can be passed to methods

This approach ensures that all protocol knowledge lives in one place - the definition files - with zero duplication.

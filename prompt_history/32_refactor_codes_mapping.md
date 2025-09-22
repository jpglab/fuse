We are building an API around Picture Transfer Protocol (PTP).

We have amassed a vast collection on this protocol (both the generic ISO spec and various vendor implementations). You have access to all of this in the `docs/` folder.

Essential background context:

- You **MUST FULLY** read this prompt before continuing.
- You **MUST FULLY** read and understand the important notes before continuing.
- You **MUST FULLY** understand the goals before continuing.
- You **MUST FULLY** read through `./AGENTS.md` before continuing.
- You _may_ read through `prompt_history/` to understand our work so far at any time.

Important notes for the migration (**ALL PHASES**):

- Any code that relates to current functionality (USB transport, generic ISO spec, Sony vendor spec) must be migrated so it works exactly the same
- If functionality does not exist in the old arch, do not attempt to guess at what it should be, just leave a TODO comment and say not implemented in old architecture
- Do not "infer" any PTP codes, vendor codes or magic bytes, only transfer over ones that exist in the old architecture
- We are moving from the old arch (`src`) to the new arch (`src_new`)
- Do not delete any code from the old arch (`src`)
- Do not refer to or import any code in the old arch (`src`) within the new arch (`src_new`)
- Do not use try/catch/finally in any tests

Our goals at this stage:

- [ ] Refactor our PTP constants into separate files that mirror the PTP spec (`Operation`, `Response`, `Event`, `Device Property`)
- [ ] Add an additional spec for `Control` – used to represent specific button presses or emulate hardware inputs on the camera (this doesn't exist in the PTP spec, so this will be left up to vendor definition)
- [ ] Extend & generalize our Property Mapper interface to work for any of these types and update the vendors specs
- [ ] Generic PTP Camera at this stage should directly mirror the implementation of the PTP spec with no overrides
- [ ] Allow specifying a description for both the PTP implementation and any vendor specific overrides
- [ ] Vendor implementations should specify whether something is an override or whether it's an extended capability outside of the scope of the orignal PTP spec (for example, if Sony uses a different code for ISO, that would be an override, but if they specify some other thing called "High ISO Noise Reduction" that's outside the scope of PTP, that would be an extension)
- [ ] Double check our PTP/ISO docs to make sure all of these mappings are correct and add descriptions for them

Success Criteria:

- [ ] `bun run all` still succeeds

We are building an API around Picture Transfer Protocol (PTP).

We have amassed a vast collection on this protocol (both the generic ISO spec and various vendor implementations). You have access to all of this in the `docs/` folder.

Essential background context:

- You **MUST FULLY** read, understand, and adhere to this prompt before continuing.
- You **MUST FULLY** read, understand, and adhere to the important notes before continuing.
- You **MUST FULLY** read, understand, and adhere to the goals before continuing.
- You **MUST FULLY** read, understand, and adhere to the success criteria before continuing.
- You **MUST FULLY** read, understand, and adhere to `./AGENTS.md` before continuing.
- You _may_ read through `prompt_history/` to understand our work so far at any time.
- You _may_ read through anything in the `docs/` folder to understand the ISO or vendor implementations of the spec.

Goals:
* It is time for a full audit of everything in our `src/constants/` folder against our `docs/` folder to verify correctness.
* Write a script that:
    * Extracts ALL hex codes (`0x00`, `0x0000`) from any source file in `src/constants/` into a nice JSON specification
    * Does a find operation for each specific hex code within the `docs/` folder and extracts the relevant piece of those docs into a new `docs/audit/iso` or `docs/audit/sony` folder where the title of the doc is the hex code we're interested in
        * For the ISO docs, you're looking for a block in `docs/iso/ptp_iso_15740_reference` similar to this, where the PropertyCode corresponds to the property we're interested in, where it continues until the next property/operation is defined with a similar structure (just fetch the block for THIS property):

            ```markdown
            ### **13.5.7 F-Number**

            DevicePropCode = 0x5007

            Data type: UINT16

            DescForms: Enum

            Get/Set: Get, Get/Set

            Description: this property corresponds to the aperture of the lens. The units are equal to the F-number scaled by 100. When the device is in an automatic exposure program mode, the setting of this property via the SetDeviceProp operation may cause other properties such as exposure time and exposure index to change. Like all device properties that cause other device properties to change, the device is required to issue DevicePropChanged events for the other device properties that changed as a side effect of the invoked change. The setting of this property is typically only valid when the device has an ExposureProgramMode setting of manual or aperture priority.
            ```

        * For the Sony docs, you're looking for a block in `docs/manufacturers/sony/ptp_sony_reference` similar to this, where the PropertyCode corresponds to the property we're interested in, where it continues until the next property/operation is defined with a similar structure (just fetch the block for THIS property):

            ```markdown
            # White Balance

            # **Summary**

            Get/Set the white balance.

            # **Description**

            | Field        | Field Order | Size (Bytes) | Datatype | Value             |
            |--------------|-------------|--------------|----------|-------------------|
            | PropertyCode | 1           | 2            | UINT16   | 0x5005            |
            ...
            ```
    * Output a count & list of what's currently in `src/constants/ptp` and `src/constants/vendors/sony` for each code saying:
        - Found & extracted documentation for code (GREEN)
        - Could find & extract documentation for code (RED)

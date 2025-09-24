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

- Optimize and simplify our build tooling.
- We have:
    - tons of scripts in `package.json`
    - tsconfig.build.json
    - tsconfig.json
    - vite.config.ts
    - vite.web.config.ts
    - vitest.config.ts
- All the settings for those are quite complicated.
- The `examples`, `scripts`, and `tests` folders sometimes have trouble importing from the `src` folder because they are one layer up. I want them to always work without having to build/have the dist folder exist.
- Package.json scripts for the following (one liners):
    - compile
    - build
    - test
    - lint
    - format
    - clean
    - all (all of the above except clean)

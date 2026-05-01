# Shape and Rule bundling scripts

This folder contains **build support scripts** that package the project’s **SHACL shapes** and **Notation3 (N3) rules** into TypeScript modules, so the evaluator can ship with **known-good, versioned defaults** and run in environments where reading files at runtime is inconvenient (e.g., browser bundles, serverless, strict deployments).

### `config.json`

Declares **which** SHACL shape files and **which** N3 rule files are considered the active set for bundling.

*   You edit this when you want to change the “default” shapes/rules that get packaged.
*   
NOTE: The rules and shapes are expected to be in either the [shapes](../src/shapes/) or [rules](../src/rules/) directory

### `makeShapes.ts`

Creates the **TypeScript shape bundle** from the configured SHACL shape files.

*   Purpose: ensure the project can import the shapes as a constant (instead of reading `.ttl` files at runtime).
*   Outcome: updates/creates a TS file under the shapes location used by the rest of the repo.

### `makeRules.ts`

Creates the **TypeScript rules bundle** from the configured Notation3 rule files.

*   Purpose: ensure the evaluator/engine can import the rules as a constant (instead of reading `.n3` files at runtime).
*   Outcome: updates/creates a TS file under the rules location used by the rest of the repo.
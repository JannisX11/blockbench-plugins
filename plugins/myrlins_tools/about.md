# Myrlin's Tools

Tools for building Hytale models in Blockbench: count and reduce nodes, check a model against Hytale's limits, start from a template and package a model as a Hytale mod. Everything runs inside Blockbench. The plugin makes no network requests and uses no AI.

## Optimize

- **Optimize Boxes** (Ctrl+Shift+O): merges neighbouring boxes that share a material to lower the box count. It shows the estimate before it changes anything, never merges stretched boxes, and can be undone with Ctrl+Z.
- **Smart Merge (Strict)** and **Smart Merge (Fuzzy)**: merge cubes that share faces, or nearby cubes with looser alignment.
- **Merge Brush** and **Quad Brush**: drag over cubes to merge them, or paint a flat quad along an edge.
- **Convert to Quad** and **Flatten to Quad**: turn thin cuboids into zero-depth quads (blade edges, hair, eyelids).
- **Palette Converter**: remaps texture colours to a Hytale-style palette.

## Check

- **Status bar and panel**: the node count as Hytale counts it (every group is a node, its first unrotated cube is free, every other cube is a node) against the limit of 255, with a per-bone breakdown.
- **Validate Hytale Model**: checks the model against Hytale's limits and lists each issue with its severity.
- **Validate for Engine** and **Validate Against Spec**: check against an engine's rules or against an asset spec (missing bones, naming).

## Build

- **New Hytale Asset**: starter models with the right structure (weapons, armour, props, creatures and more).
- **Auto-Group by Proximity**, **Build Hierarchy** and **Smart Rename**: group, structure and name loose cubes.
- **Export Hytale Mod Package**: the model with its JSON configs as a mod .zip.
- **Mod Project**: keep the assets of one mod together.

## Notes

- Hollow Interior is switched off in this version and shows as "coming back soon".
- Validation lists issues for you to fix by hand; it does not change the model.
- Source: the `src` folder next to this file (TypeScript, bundled with esbuild; see `src/README.md`).
- Made by Myrlin (forge.myrlin.io).

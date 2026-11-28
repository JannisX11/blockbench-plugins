**ParticleCue Studio** is a multi-format VFX authoring, preview, and portable project sharing workbench for Blockbench Desktop (`5.0.0+`, verified on `5.2.2`).

### Key Features

- **LumenFX 0.3.3 Live Authoring & Preview**: Photon-style Emitter/Module Inspector (`sprite`, `ribbon`, `beam`, `mesh`), interactive SVG Curve & RGBA Gradient editors, KilaMaterial 6-module composer, **KilaGraph** visual GLSL node shader editor (28 nodes, 5 presets, live WebGL2 `GLSL OK` check, native `.fsh` export), `.lfmesh` binary decoding, dynamic lights, volumes, decals, and collision.
- **Multi-Format Particle Support**:
  - **Snowstorm / Bedrock (`.particle.json`)**: Visual parameter editor with lossless write-back plus comprehensive Wintersky preview fixes (4 blend/depth modes, Flipbook UV/FPS clamping, all Billboard camera modes, Molang curves, `pre_effect_script` execution order, and pixel-exact deterministic backwards timeline scrubbing).
  - **Photon `.fx`**: Zero-dependency lossless GZIP Minecraft NBT reader/writer preserving all unknown compounds and arrays.
  - **KBR 3D Particles**: Full `particle_definitions/*.json` & `particle_models/*.json` editing (`geckolib`, `geometry`, `poly_mesh`, `hardcode`), live material/double-sided/variant switching with format-mismatch diagnostics, and resource-pack export.
  - **Unity Shuriken / UE Niagara Exported Assets**: Live preview and non-destructive parameter overrides preserving compiled programs and `.lfsc` / `.lfvf` references.
- **Cross-Machine Portable Projects & Batch Relink**:
  - **One-Click Batch Relink**: Scans missing particle, texture, and shader references and relinks from one asset root folder with mandatory ambiguity disambiguation.
  - **Portable ZIP**: Exports standard relative-path `.bbmodel` alongside all particles, textures, external `.fsh` shaders, `.lfmesh` meshes, and KBR 3D models with strict archive path-safety checks.
  - **Self-Contained `.bbmodel`**: Embeds all particle definitions, textures, `.fsh` shaders, `.lfmesh` meshes, and KBR models inside a single `.bbmodel`.
- **Optional Ecosystem Integration**: Works completely standalone, and automatically integrates when co-installed with **AnimCue Studio** (multi-actor same-name locator disambiguation) and **PAL Bend Player Tools** (live bent-limb world-pose tracking & `.emote.json` export).

### Documentation

- [English Wiki](https://github.com/kltyton/ParticleCue-Studio/wiki) · [中文 Wiki](https://github.com/kltyton/ParticleCue-Studio/wiki/Home-zh)
- [Source Repository](https://github.com/kltyton/ParticleCue-Studio) · [中文说明](https://github.com/kltyton/ParticleCue-Studio/blob/main/README_zh.md)

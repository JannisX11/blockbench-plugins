# Myrlin's Tools

A comprehensive toolkit for Hytale model creation in Blockbench.

## Features

**Optimization**
- Box Optimizer: merge adjacent boxes to reduce count (spatial-hash O(n))
- Hollow Interior: remove hidden internal boxes
- Node Budget: visualize per-bone node distribution

**Validation**
- Art Style Validator: check against Hytale requirements (255 nodes, pixel ratios, stretch limits)
- Engine Validation: validate for Hytale, ModelEngine, or FreeMinecraftModels
- Severity grading: ERROR / WARNING / INFO with one-click fixes

**Auto-Repair**
- Naming normalization (PascalCase)
- Aspect ratio fixer (split extreme cuboids)
- Hierarchy repair (auto-grouping)
- Node limit reducer (merge + hollow)
- Symmetry enforcement

**Export**
- Multi-engine export: Hytale (.blockymodel), Blockbench (.bbmodel), ModelEngine (YAML)
- Format-aware validation before export
- Blockbench 5.0 compatible

**Templates**
- Template Wizard: create correctly structured starter models
- Config Generator: export model + JSON configs as mod .zip

**Community**
- Model Browser: browse and import from the Myrlin gallery

## Installation

Install from the Blockbench plugin store, or install from URL:
```
https://forge.myrlin.io/plugins/myrlins_tools.js
```

## AI Add-on

For AI-powered features (semantic naming, repair suggestions), install the separate add-on:
```
https://forge.myrlin.io/plugins/myrlins_ai.js
```
Requires the core plugin to be installed first.

## Requirements

- Blockbench 4.8.0 or later
- Internet connection for model browser and API-based validation (offline mode available)

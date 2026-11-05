# JPEG Compressor

**Soft / Standard / Deep-fry JPEG compression with live 2D + 3D preview**

Apply realistic JPEG artefacts to any texture in Blockbench. Choose between clean messenger-style compression, classic 4:2:0 JPEG, or aggressive multi-pass deep-fry. See the result instantly on both the texture and the 3D model.

---

## Features

### Three compression modes

| Mode | Description |
|------|-------------|
| **Soft** | Full chroma (4:4:4). Minimal colour bleeding. Closest to high-quality messengers (Telegram-style). |
| **Standard** | Classic JPEG 4:2:0. Chroma is averaged in 2×2 blocks. Stronger, familiar artefacts. |
| **Deep-fry** | Multiple JPEG passes at the selected quality. Artefacts accumulate with each pass. Maximum meme look. |

### Strength slider (1–100)

- **1–20** — light  
- **21–45** — medium  
- **46–70** — heavy  
- **71–90** — deep-fried  
- **91–100** — extreme  

The strength value is mapped to real JPEG quality and (for Deep-fry) number of passes, including fractional blending of the last pass for smooth control.

### Live dual preview

- **2D** — pixel-perfect texture view with Ctrl+Wheel zoom and drag-to-pan  
- **3D** — the actual model geometry with original UVs and materials.  
  Rotate (LMB), pan (RMB / Shift+LMB), zoom (Wheel).  
  Optional shading toggle and “Reset view”.

### Transparency handling

- Flatten transparent pixels onto white or black before compression (real JPEG has no alpha)
- Optionally restore the original alpha channel afterwards

### Other

- Apply directly to the selected texture (Undo-supported)
- Save as a new texture variant
- Russian & English UI
- Works with large textures (up to ~5.5 MPx / 8192 px side)
- Handles animated textures, non-colour channels, missing UVs, and unassigned textures gracefully with temporary warnings

---

## Usage

1. Select a texture (or leave the currently selected one).
2. Open **Tools → JPEG Compressor**.
3. Adjust strength, mode, matte colour and alpha option.
4. Watch the 2D and 3D previews update in real time.
5. Click **Apply** or **Save as New**.

---

## Technical notes

The plugin implements the lossy stage of JPEG itself (RGB → YCbCr → optional 4:2:0 → DCT → quantisation → IDCT → RGB). Huffman coding is skipped because it is lossless. Processing is chunked and yields to the UI so the dialog stays responsive even on large textures.

---

**Author:** the0dll  
**Version:** 1.0.0  
**Minimum Blockbench:** 4.8.0  
**Variant:** both (desktop + web)

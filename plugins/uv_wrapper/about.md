# About UV Wrapper

UV Wrapper lets you transfer UVs and textures from one face to another in real time with a simple drag — like wrapping a sticker across the surface of your model.

### How it Works

1. Select the **UV Wrapper** tool from the toolbar (or press **Ctrl+Shift+U**).
2. Hold **Alt** and click a face to set it as the **source** (orange highlight).
3. Drag across target faces — they instantly receive the source face's UV layout and texture (green highlight).
4. The face under the cursor is highlighted in blue.

### Modifier Keys

| Key | Action |
|---|---|
| **Alt** (configurable) | Pick the source face |
| **Shift** (configurable) | Fill a flat plane of coplanar faces at once |
| **Ctrl** (configurable) | Planar projection — transfer UVs without folding across edges |

All modifier keys can be remapped in **Settings → Edit**.

### Visual Feedback

- 🟠 **Orange** — source face
- 🔵 **Blue** — hovered face under cursor
- 🟢 **Green** — target faces that will receive the UV wrap

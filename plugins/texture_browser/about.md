# About Texture Browser

Texture Browser lets you browse textures from any local folder and assign them to selected faces with a single click — no need to manually import each texture first.

### How it Works

1. Click **Browse** to select a root folder on your disk.
2. The plugin scans the folder and displays all textures as a grid of thumbnails.
3. Type in the **Filter** field to narrow results — supports glob patterns (`*.png`, `brick_*.jpg`) and plain substrings (`brick`).
4. Click any thumbnail to assign that texture to **all selected faces** across all selected meshes.
5. Toggle **Only Used** to show only textures currently assigned in the project.

### Settings

- **Max Folder Depth** — how many subfolder levels to scan (1–10)
- **Thumbnail Size** — scale of thumbnails in the grid (10%–200%)
- **Remove Unused Textures** — automatically delete textures that become unreferenced after reassignment

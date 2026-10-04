## How to use Let There Be Noise

1. Select a texture in the textures panel in Paint Mode
2. Click the Image dropdown in the toolbar
3. Adjust the settings:
 - **Amount** = Strength of the noise applied
 - **Coverage** = Percentage of pixels affected in the image or selection
 - **Seed** = The seed for the noise applied allows for deterministic noise across texture variants
 - **Mode** = Uniform by default, provides additional options. Selecting **per channel** allows you to **apply/filter** noise to targeted colour channels

4: Click **Confirm** to apply the changes to the texture/selection

### Per Channel Mode
- As listed above in mode, **per channel** applies noise to specific RGBA channels individually. This is intended for editing packed textures like MERS without affecting other colour channels.

### Additional features
- Supports selections, select an area first to apply noise within that region
__Create textures for Bedrock shaders with PBR support (Deferred Rendering / RTX)__

## Features

### PBR Material Preview
- Preview PBR textures in Edit, Paint, and Animate mode.
- Infers texture channels based on naming conventions when no channel has been explicitly defined. Intended for previewing imported Bedrock PBR textures.

> _PBR:_ Physically based rendering

#### Auto-Updated Preview
- PBR materials are updated with every edit to provide a <small>(nearly)</small> live painting preview of the material in Blockbench.

### MER Maps
> _MER:_ Metallic, emissive, and roughness maps assigned to red, green, and blue channels respectively. It is the format used in Bedrock texture sets.
#### Decode MER
- MERs can be inferred and decoded automatically when PBR mode is enabled.
- Decoding can be _slow_ on large textures (1024x+).
- Assign an albedo map prior to decoding a MER to extract the emissive color.

#### Export MER
- Compiles metal, emissive and roughness channels into MER texture.
- (Emissive colors will be lost upon export. Use grayscale values in emissive channels for accurate brightness levels.)

### Generate Normal Map
- Calculate normal map based on the assigned or inferred height map for the currently selected material/texture.

### Export Texture Set
- Create a `.texture_set.json` file for the project textures.
- Dialog allows defining values which can not be inferred from project.
- Exports MER in the process.

## Usage

### PBR Settings

This plugin adds the _PBR Settings_ panel, which controls enabling and disabling PBR materials in Blockbench previews.

#### Toggle PBR

- Use the _PBR Preview_ toggle to toggle or refresh the PBR preview. Also found in the _View_ menu.

> <details>
> <summary>Usage Tip</summary>
> Toggling the PBR preview off and on may solve any texture discrepancies. Allowing the scene to render again will ensure all textures are up-to-date in the preview.
> </details>

#### Toggle Corrected Lighting

- Use the _Correct Lights_ toggle to enable or disable physically-corrected lighting in the preview scene. This may improve the appearance of reflective and emissive materials in the preview scene, but will dim the albedo/base color texture.

### Channel Management

Control which textures or texture layers are used for PBR channels using the following methods:

#### Create Material Texture

- Use the _Create Material Texture_ action to create a blank texture with PBR material layers initialized.

#### Channel Naming Convention

The plugin will assume that textures and layers which end in an underscore and a channel name are intended to be used as that channel. For example, `texture_roughness` will be used as the roughness map unless the channel has been manually assigned a texture.

##### Supported Channels
| Channel   | Description | Colorspace |
|-----------|-------------|------------|
| `ao`      | Ambient Occlusion | __BW__ |
| `albedo`  | Albedo / Base Color | __RGB__ |
| `normal`  | DirectX Normal Map | __RGB__ |
| `metalness` | Metallic map | __BW__ |
| `roughness` | Roughness map | __BW__ |
| `emissive` | Emissive map | Displayed in __RGB__; Exported as __BW__ in MER |
| `sss` | Subsurface Scattering | __BW__; Not supported by shader but exported in MER alpha channel |

#### Explicit Channel Assignment

Create a Texture Layer in Blockbench to enable channel assignment in PBR previews. Each channel can be selected from a menu and applied to the current material. The menu is visible in the _PBR Settings_ panel when in Paint mode. The menu options are also available in the _Image_ menu.

#### Removing Channel Assignment

Channels can be disabled by hiding or deleting the layer, or un-assigning the channel in the menu. Texture layers cannot be assigned to more than one channel. Assigning a layer to a new channel will clear the layer's current channel.

### Material Brush Tool

Use the _Material Brush Tool_ to paint across multiple PBR channels simultaneously.The controls found in the _Material Brush Panel_

- The current color selected in the main color picker is used as the albedo color.
- Only visible layers with channels assigned will be updated by the brush.

### Plugin Settings

The following Blockbench settings are added by this plugin:

#### Global Metalness / Roughness

- Adjusts the metalness or roughness multiplier used in the PBR Preview scene.

#### Tone Mapping

- The _Tone Mapping_ setting will apply various tone mapping techniques to the preview scene. Use the _Linear_ option to match the tone map used by most Bedrock shaders.

#### Exposure

- The scene exposure can be adjusted once a tone map technique is selected. Values range from -2.0 to 2.0. (Exposure settings only work when tone mapping is applied.)


---

## Roadmap
- Java project support
- labPBR texture exports
- Preview scene PostFX
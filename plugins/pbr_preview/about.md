**Create and view PBR textures in Blockbench. Exports in formats for labPBR
(Java) and RenderDragon (Bedrock) shaders.**

> **_PBR:_ Physically based rendering**\
> Read the
> _[Intoduction to Physically Based Rendering](https://learn.microsoft.com/en-us/minecraft/creator/documents/rtxpbrintro?view=minecraft-bedrock-stable "View Minecraft Creator documentation article.")_
> article in the Minecraft Creator documentation if you are not already familiar
> with creating PBR content for Bedrock Edition. Visit the
> [shaderLABS wiki](https://shaderlabs.org/wiki/Main_Page) for more information
> on the labPBR material standard.

## Blockbench PBR Plugin Features

### PBR Material Preview

- Preview PBR textures in Edit, Paint, and Animate mode.
- Infers texture channels based on naming conventions when no channel has been
  explicitly defined. Intended for previewing imported existing Bedrock and Java
  PBR textures.
- Uses Blockbench's preview scenes as model environment map.
- PBR materials are updated with every edit to provide a live painting preview
  of the material in Blockbench.

### MER Maps

> _MER:_ Metallic, emissive, and roughness maps assigned to red, green, and blue
> channels respectively. It is the format used in Bedrock texture sets.

#### Decode MER

- MERs can be inferred and decoded automatically when PBR mode is enabled.
- Decoding can be _slow_ on large textures (1024x+).
- Assign an albedo map prior to decoding a MER to extract the emissive color.
- Channels extracted from a MER can be saved as either separate textures or into
  separate layers in a single texture.

#### Export MER

- Compiles metal, emissive and roughness channels into MER texture.
- (Emissive colors will be lost upon export. Use grayscale values in emissive
  channels for accurate brightness levels.)

### Generate Normal Map

- Calculate normal map based on the assigned or inferred height map for the
  currently selected material/texture.

### Generate Ambient Occlusion Map

- Generate an AO map from the material's normal map. (AO available in some
  labPBR shaders.)

### Texture Baking

- Bake a normal and emissive maps onto the base color channel.
- Output multiple light positions.
- Choose ambient light settings before baking.

### Export Texture Set

- Create a `.texture_set.json` file for the project textures.
- Dialog allows defining values which can not be inferred from project.
- Exports MER and normal maps in the process.

### labPBR Specular/Normal Maps

- Export `_s` and `_n` files for PBR textures created in Blockbench.
- Decode existing, imported labPBR textures into PBR material channels.

### Material Brush

- Paint across multiple PBR channels simultaneously for a consistent material
  output.
- Save material brush presets to a collection.
- Automatic PBR preview updates after every brush stroke.

## Usage

### PBR Controls

This plugin adds the _PBR Controls_ panel, which controls enabling and disabling
PBR materials in Blockbench previews.

#### Toggle PBR

- Use the _PBR Preview_ toggle to toggle or refresh the PBR preview. Also found
  in the _View_ menu.

> <details>
> <summary>Usage Tip</summary>
> Toggling the PBR preview off and on may solve any texture discrepancies. Allowing the scene to render again will ensure all textures are up-to-date in the preview.
> </details>

#### Toggle Corrected Lighting

- Use the _Correct Lights_ toggle to enable or disable physically-corrected
  lighting in the preview scene. This may improve the appearance of reflective
  and emissive materials in the preview scene, but will dim the albedo/base
  color texture.

#### Tone Mapping

- The _Tone Mapping_ select will apply various tone mapping techniques to the
  preview scene. Use the _Linear_ option to match the tone map used by most
  Bedrock shaders.

#### Exposure

- The scene exposure can be adjusted once a tone map technique is selected.
  Values range from -2.0 to 2.0.

### Channel Management

Control which textures or texture layers are used for PBR channels using the
following methods:

#### Create Material Texture

- Use the _Create Material Texture_ action to create a blank texture with PBR
  material layers initialized.\
  If an existing texture is selected, it will be used as the albedo channel in
  the PBR material. If the project has other textures, include those textures in
  the selection to have them automatically assigned to the new material's PBR
  channels.

Follow these naming conventions to ensure the textures are assigned to the
appropriate channels when creating a new material:

#### Channel Naming Convention

The plugin will assume that textures and layers which end in an underscore and a
channel name are intended to be used as that channel. For example,
`texture_roughness` will be used as the roughness map unless the channel has
been manually assigned a texture.

##### Supported Channels

| Channel     | Description           | Colorspace                                                        |
| ----------- | --------------------- | ----------------------------------------------------------------- |
| `ao`        | Ambient Occlusion     | **BW**                                                            |
| `albedo`    | Albedo / Base Color   | **RGB**                                                           |
| `normal`    | DirectX Normal Map    | **RGB**                                                           |
| `metalness` | Metallic map          | **BW**                                                            |
| `roughness` | Roughness map         | **BW**                                                            |
| `emissive`  | Emissive map          | Displayed in **RGB**; Exported as **BW** in MER                   |
| `sss`       | Subsurface Scattering | **BW**; Not supported by shader but exported in MER alpha channel |

###### Supported Minecraft Shader Channels

RenderDragon and labPBR textures are automatically decoded and displayed when
the channels can be inferred based on the existence of MER, specular, or normal
maps. Some features are not supported by the Blockbench preview's shader, such
as AO and POM, but can still be decoded/encoded during texture import/export

#### Explicit Channel Assignment

Create a Texture Layer in Blockbench to enable channel assignment in PBR
previews. Each channel can be selected from a menu and applied to the current
material. The menu is visible in the _PBR Controls_ panel when in Paint mode.
The menu options are available in the _Image_ menu, as well as in the context
menu of a texture or layer, and in the Layers panel.

#### Removing Channel Assignment

Channels can be disabled by hiding or deleting the layer, or un-assigning the
channel in the menu. Texture layers cannot be assigned to more than one channel.
Assigning a layer to a new channel will clear the layer's current channel.

#### Finding Assigned Channels

When in Paint mode, select a texture with material layers assigned to reveal the
_Select PBR Channel_ menu button in the _PBR Controls_ panel. This menu lists
the channels currently assigned by the selected texture. Click a channel in the
menu to have it selected in the Layers panel.

### Material Brush Tool

Use the _Material Brush Tool_ to paint across multiple PBR channels. The
controls found in the _Material Brush Panel_.

- Set the metallic, roughness and height values on a scale of 0% - 100%
- Use the color picker in the _Material Brush Panel_ to set the emissive color.
- The current color selected in the main color picker is used as the albedo
  color.
- Only visible layers with channels assigned will be updated by the brush.
- Blockbench's paint brush size and smoothness settings control the material
  brush's settings as well.

#### Material Brush Presets

Open the _Material Brush Presets_ dialog to define and save new brush settings,
or to select and apply existing presets. A material preview is generated upon
saving a preset. Select a preset to populate its values in the Material Brush
input controls.

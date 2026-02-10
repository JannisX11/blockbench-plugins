This plugin adds support for the `.blockymodel` and `.blockyanim` file formats that can be used to create and edit models for Hytale.

Select a Hytale format from the start screen and click Create New Model to get started!

## Features

### Hytale modeling support
* Support for opening, editing, and saving models for Hytale
* A customized workspace and validation to ensure models are created in a compatible way
* Automatic UV sizes that are locked to face dimensions to ensure UV consistency
* The stretch tool and sliders can be used to adjust cube sizes without affecting UV
* Attachment support built on collections. Attachments are anything from hairstyles to clothing items and weapons that can alter the design of a character.

### Hytale animation support
* Support for animations for Hytale models
* Visibility keyframes
* UV Offset keyframes
* Quaternion-based interpolation
* Keyframe-wrapping for looping animations

### Quality-of-life features that the Hytale team uses!
* Hytale preview scene and player reference model, to use as a size reference
* UV Cycling: Click in the UV editor multiple times to cycle between overlapping faces at that spot
* Hold Alt while moving elements to duplicate them
* A thicker and always visible pivot marker to ensure the pivot point is well visible. The group pivot is also shown when editing child cubes, so you always know where geometry will rotate from when animating.
* Clear, outline-only UV editor mode to make it easier to work with overlapping UVs. Enable UV Outline Only in the settings
* Copy-Paste with Magenta Alpha setting, to improve copy-pasting from and to Photoshop (which doesn't support copy pasting with transparency)
* Toggle to lock attachments from editing, hiding them from the outliner and viewport selection
* Reload all attachments action to quickly refresh attachment geometry from disk

## Usage tips

### Guidelines
* As a size reference, the center grid in a new Hytale project represents one block in-game. This measures either 32 pixels for props and blocks or 64 pixels for characters and attachments. Hytale preview scene and player model reference can be enabled from the Preview Options menu and are another useful size reference.
* Models should not have more than 255 nodes. Nodes are a concept in the Hytale model format, each group counts as a node, and each cube/quad counts except if it's the first cube in a respective group. The number of nodes can be seen by clicking on the element counter above the outliner.
* Scale keyframes animate the stretch value of the attached cube. When animating scale, counter-animate the position if you want to scale from the side, and keep in mind that child bones and other cubes are not affected by the scale.
* UVs must always match the dimensions of their face, the format does not consider custom UV sizes.

### Notes about nodes and shapes
Hytale's Blockymodel format works slightly different from how Blockbench usually works. In Edit mode this difference is not noticable and hidden by the importer and exporter. However, in animations, some features may behave differently due to this.
Hytale uses "Nodes", which are a combination of a group (for the transformation and hierarchy) and a cube (for the visual part). Position and Rotation animations target the group, so all child groups and cubes inherit it. However, Scale, Visibility and UV Offset only target the Shape itself, so it only applies to the cube. In practice, in your Blockbench project, this cube is the first cube that is a direct child of the group and does not have its own rotation. This cube gets exported as the shape of a node and is targeted by its animations and not counted as an extra node towards the node count limit. If there are more cubes or they have their own rotation, they will get exported as separate nodes.

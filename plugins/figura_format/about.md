Figura uses Blockbench for it's modeling, but some features of Blockbench will not be parsed by Figura.

This Plugin adds a Project Format that will make the following changes to Blockbench:
* New Animations will be named `new` instead of `animation.model.new`.
* The "Anim Time Update" Animation property has been renamed to "Start Offset" to reflect how the property is parsed by Figura.
* The "Override" Animation property has been renamed to "Override Vanilla Animations" to better reflect how the property is used by Figura.
* Added "Copy X Path" under the Right Click context menu for Cubes, Groups, Meshes, Animations, and Textures.
  * Copies the full script path as dictated by Figura's scripting API.
  * Assumes the bbmodel is at the root of the avatar.
* Added "Add Animations from .bbmodel..." under Animation.
  * Allows you to select a bbmodel and imports all animations you select, replacing old animations.
  * Intended to replace "Export Animations to file, then import file" workflow.
* Added "Allow Duplicate Names" which can be found in the Figura Plugin Settings (File->Plugins->Figura Format->Settings)
  * Enabling this bypasses the group name restrictions, such as duplicate group names and special characters in group names.
  * Will break certain Blockbench Animation features. Use at own risk.
* Added "Recalculate UVs" under UV.
  * Scales an entire texture's uvs to match a new texture size.
  * Useful for fixing Texture Size related issues.
* Added "Optimize Model" under Tools.
  * Provides batch operations related to optimizing a bbmodel for filesize when compressed to a Figura Avatar.
* Removed Blockbench Animated Textures.
* Removed File Name textbox.
* Removed Model Identifier.
* Removed Molang Errors.
* Removed Texture Render Mode from the Texture Properties.
* Removed Particle and Sound keyframes.

<i style="pointer-events: none;color: black;opacity: 0.1;font-size: 700px;height: 614px;width: 584px;position: absolute;bottom: 0;right: 0;
overflow: hidden;max-width: unset;" class="material-icons">change_history</i>
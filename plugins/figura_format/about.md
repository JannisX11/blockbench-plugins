Figura uses Blockbench for it's modeling, but some features of Blockbench will not be parsed by Figura.

This Plugin adds a Project Format that will make the following changes to Blockbench:
* New Animations will be named `new` instead of `animation.model.new`.
* The "Anim Time Update" Animation property has been renamed to "Start Offset" to reflect how the property is parsed by Figura.
* The "Override" Animation property has been renamed to "Override Vanilla Animations" to better reflect how the property is used by Figura.
* Added "Copy ModelPart Path" under the Right Click context menu for Cubes, Groups, and Meshes.
  * Copies the full script path of the ModelPart as dictated by Figura's scripting API.
* Added "Match Project UV with Texture Size" under Edit.
  * When enabled and in PerFaceUV Mode, the ProjectUV will be changed to match the current active texture making using Textures of different sizes less of a pain.
* Added "Add Animations..." under Animation.
  * Allows you to select a bbmodel and imports all animations you select, replacing old animations.
  * Intended to replace "Export Animations to file, then import file" workflow.
* Added "Bake IK into Animations" under Animation when in the Animate tab.
  * Bakes Inverse Kinematics to raw keyframes. Figura cannot parse IK, so baking it to raw rotation keyframes is required to use IK in Figura.
* Added "Cycle Vertex Order" as one of the mesh editing buttons when at least one Face is selected.
  * Cycles the vertices of a Quad in order to change how textures are rendered on it when triangulated.
  * Will invert the face. Use the "Invert Face" button to fix this.
* Removed Blockbench Animated Textures.
* Removed Model Identifier.
* Removed Molang Errors.
* Removed Texture Render Mode from the Texture Properties.
* Removed Particle and Sound keyframes.

<i style="pointer-events: none;color: black;opacity: 0.1;font-size: 700px;height: 614px;width: 584px;position: absolute;bottom: 0;right: 0;
overflow: hidden;max-width: unset;" class="material-icons">change_history</i>
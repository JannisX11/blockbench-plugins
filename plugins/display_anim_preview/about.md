# Java Display Animator

Create, preview, and export frame-baked Minecraft Java item animations in Blockbench Desktop. Choose which display contexts animate, then generate a resource pack and its animation-driving datapack together.

## Plugin feature management

Use **Tools → Java Display Animator → Java Display Animator Project Settings** to manage the project in one paged window. Its six pages are **General**, **Player Arms**, **Animations**, **Pack Files**, **Datapack**, and **Developer API**. Configure the item and project names, animation selection and default animation, 1–20 FPS sampling, output locations, datapack settings, and command examples.

Changes update the current project's settings immediately. Save the `.bbmodel` to retain them on disk; closing the settings window does not save or overwrite the model automatically. Internal object settings remain serialized but are hidden from Blockbench's native project form.

The Tools submenu also groups the display preview, first-person preview, bounds checks, and export. Pack export is additionally available under **File → Export** and in command search.

## First-person animation authoring

In **Animate** mode, the dockable **First-person Animation Preview** shows the item from the left- or right-hand first-person view while the main viewport remains available for editing and bone selection. It follows the official timeline during playback and scrubbing. Changing the preview hand does not move the main editor camera or create another timeline.

Open or reopen it using the timeline eye button, **Animation → Open First-person Preview**, or the plugin's Tools submenu. New **Java Display Animation** projects automatically open the separate **Display Animation Preview** controls, including when the panel was previously folded. Animation switches are saved independently for each display context.

## Player-skin arms

Enable optional arms in **Project Settings → Player Arms** to create editable left/right arm bindings. Animate their position and rotation alongside the item. First-person exports include the arms, and the generated give command supplies the player's skin profile in Minecraft. Other display contexts retain the item without added arms. Editor arm placeholders show the rig and poses; verify the final skin appearance in Minecraft.

**Player-skin arms currently require Minecraft Java 1.21.11 or newer.** Keep shader packs disabled; arm scale keyframes are unsupported. The version notice is visible before and after enabling arms.

## Export and bounds checks

- Select multiple animation tracks and a default animation, with sampling from 1 to 20 FPS.
- Preview independent animation settings for first-person, third-person, GUI, ground, head, item-frame, and other supported display contexts.
- Run cancellable quick mathematical or exact isolated bounds checks. Closing the mode chooser or pressing Escape cancels without starting a scan.
- Bake in an isolated project and deduplicate identical model frames across animations.
- Create resource packs and datapacks, or transactionally insert project-owned files into existing unpacked packs.
- Use short per-animation commands and a dynamic macro API; each generated item keeps its own playback state.

## Quick start and compatibility

1. Create a **Java Display Animation** project, build the item, and animate its groups.
2. Configure transforms in **Display** mode and choose which display contexts animate.
3. Open **Project Settings** to select animations, FPS, optional arms, and output locations.
4. Choose **File → Export → Export Resource Pack and Datapack**, review warnings, and install the generated packs.
5. Run the commands shown after export and verify the result in Minecraft.

Requires **Blockbench Desktop 5.1.5+**. The current exporter targets **Minecraft Java 26.2**. The arm feature's minimum version does not imply that generated packs load unchanged on every version above 1.21.11.

[Source and complete guides](https://github.com/rieyi/display-anim-preview) · [Report an issue](https://github.com/rieyi/display-anim-preview/issues)

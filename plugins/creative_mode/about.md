### Fly like in creative Minecraft
- From 'WASD Control plugin': Use AWSD to move around, E to go up, Q to go down (keybinds are configurable).
- Use Shift to fly faster or Alt to fly slower (keybinds are configurable).
- You can change the sensitivity of the camera, speed of flight, speed modifier for "go faster (shift)" and "go slower (alt)".

### Painting the world
- Select a "brush" (Cube).
- Press T or click the icon to toggle the tool.
- Start painting by clicking with the Right Mouse Button on other cubes.
- Use Left Click to remove blocks, or Ctrl + Z to undo.
- If you want to select a different brush, or customize the current one, just press T again to deactivate the tool and select a different brush (Cube).
- Differently from Minecraft there's no limit distance to place blocks, so you can remove or place a block from really far away.


### Demo
- Checkout this discord thread with some videos (https://discord.com/channels/314078526104141834/1264973145681559674), I'll need to join the Blockbench discord server to see it.


### Known issues
- The plugin may act weirdly when placing blocks with rotations or scales that differ from each other.
- The Outliner can flicker up and down when placing lots of blocks. Selecting something in the outliner usually fixes that.
- The performance can be a little weird when placing thousands of blocks in the same scene. However, that fixes itself when restarting the app, it's inconsistent what triggers the frame drops in this case.

### Limitations
- It's not supported to place a cube in a Mesh or in the "void".
- While placing a tiny block in a huge block, that placement can be weird and offset to some corner. That's tough to fix, so there's no planning for that.
- It's not possible to Ctrl + S to save the project while the tool is active. That's due to the WASD movement for the navigation.
- It's not possible to position multiple blocks at the same time.


### Future ideas
- The plugin no longer implements a simple tool, but a new "edit mode" called 'Creative', placed next to Edit / Paint / Animate. This new tab will not show any Gizmo or selection; it will only be for 'placing and removing cubes'. 
 - This new tab would have its own group system to help group the new cubes created; I've been using the plugin for creating a level design for my game, and I got 1000+ cubes in the scene, so it's important to have some group organization.
 - A new interface in this new tab, that would take the UV place, displaying the current selected cube (aka. the current Sample Cube used for painting the world).
- A system that lets the user place cubes in an empty grid. The current state only lets the user place a cube next to another cube, so that can be a bit annoying at times.
- Add middle click to pick blocks like in Minecraft (Suggested by Jannis).
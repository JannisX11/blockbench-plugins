# 👁️ Farsight
Farsight is a Blockbench Plugin that increases the culling distance. Perfect for creating whole worlds.

![alt text](<Images/Farsight_Banner.png>)

## ⚙️ Farsight can be Configured
Use this option under the Tools Menu to increase the Clipping Limit.

![alt text](<Images/Farsight_Image.png>)

## ⛰️ Understanding of Scale
*The map of Final Fantasy XV's playable area is around 128000m. Or 64km².*

*That is also the size of the purple plane.*

*If you somehow need to craft a world that's bigger than 1,000,000m, you can increase the cap manually. Check:* `Line 64 in farsight.js`

## ⚠️ Warning!
Blockbench was not built to work with meshes and textures at this size.

`Creating a Texture` is a very dangerous choice. I recommend always importing textures when working with large meshes.

And playing on this, no matter your game engine, without splitting and chunking it into pieces won't be an easy thing to do. Consider how you can break your world apart into pieces, or even better, into seperate levels.

## 🖥️🌐 Install
Installation is the same as every other Blockbench Plugin. Simply grab it from the Plugin Store, or Load the Plugin from the Javascript (`farsightjs`) file.
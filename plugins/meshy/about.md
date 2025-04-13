# Meshy
Meshy is a plugin for Blockbench that allows you to create meshes from your bedrock models and import them into Minecraft. 

It's pretty simple just download the plugin and make a mesh like you normally would. Then add the geometry to your project.
Alternatively you can also import an obj file then export it as a mesh. File -> Import -> Import OBJ File.

It may also be slower for large meshes or if you don't have a the best computer. I've tested it quite large meshes and it works fine. But millage may vary.
## Settings

### Normalize UVs 
This will normalize the UVs of the mesh so that they are all between 0 and 1. This on by default it works either way but it is recommended to turn it on. So that if you change the texture size it will still be proprietary sized.

### Meta Data
This is an extra feature that adds some data to the mesh so that when you import it back into blockbench it will become the original model. This is on by deafult but if you want to have a smaller file size it's recommended to turn it off. It's for all the peices of a mesh to be reconstructed and that roatation and postion of the mesh are maintained.

### Skip Normals
This is a feature that skips the normal calculation for the mesh. This is off by default becuase most of the time you want to have the shading information. It will result in a smaller file size and will be faster to export. ( Not a major diffrence but it is a diffrence )

### Force Multi-Textures
This forces multiple textures to be used for bedrock models. This is off by default sense bedrock models can only have one texture. This force them to be enabled. But you will need to stitch the textures before you try puttinng them in minecraft. The plugin Texture Stitcher by mchorse can do this for you.

## CONTRIBUTING
If you want to contribute to this plugin please make a pull request at my [GitHub repository](https://github.com/Shadowkitten47/Meshy). Also check that the change hasn't already been made onto that version sense I work on that quite a bit. If for some reason I don't respond or abonded the project or for any other reason that you want to make a change directly to BB make sure to comment Your username, What you changed, and why.
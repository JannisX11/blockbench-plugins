# Mr Salmon's Baked Ambient Occlusion for Blockbench

Generate instant shaded textures for your models, with one click! Ambient occlusion works by working out how much light can reach each pixel on the model: areas in crevices and divots receive less light than those at the edge of the model. By exaggerating this effect, you can create depth, as crevices also often pick up dirt, becoming even darker, and the edges of hard objects (like rocks, wood, metal, etc.) often get worn, becoming even lighter.

*Before*
![](https://github.com/kaisalmon/MrsSalmonsBlockbenchBakedAmbientOcclusion/blob/main/examples/BenchFlat.gif)

*After*
![](https://github.com/kaisalmon/MrsSalmonsBlockbenchBakedAmbientOcclusion/blob/main/examples/Bench.gif)

## Building and installing.

To install clone the repo, and run `npm install` and then `npm build`. This will create a file at `dist\blockbench-baked-ao.js`. In Blockbench, you can then go to plugins, and select "load from file", and select the file you just created.

## Using the plugin

Select your mesh, and go to Tools > Bake Ambient Occlusion

<img width="366" height="240" alt="image" src="https://github.com/user-attachments/assets/d43d35cb-b9e1-41ef-afa6-dbd9d960bd8e" />


## Settings
<img width="491" height="691" alt="image" src="https://github.com/user-attachments/assets/ba7175f1-db3d-4819-8847-5563d741502b" />

### **Highlight Color**
Color used for areas with high ambient lighting

### **Highlight Opacity** 
Opacity of the highlight color overlay

### **Highlight Gamma**
Gamma correction for highlight areas (lower = more contrast)

### **Shadow Color**
Color used for occluded/shadowed areas

### **Shadow Opacity**
Opacity of the shadow color overlay

### **Shadow Gamma**
Gamma correction for shadow areas (higher = softer shadows)

### **Samples per pixel**
Number of samples per pixel (higher = better quality, slower). 100 recommended for uniform sampling, 1000 for random sampling.

### **Sample Method**
Method for sampling ambient occlusion rays. Random is slightly more accurate but noisier, uniform is smoother for less samples but is more prone to artifacts.

### **Ambient Occlusion Radius**
Radius for ambient occlusion effect (Bigger is better for larger models or higher-resolution textures)

### **Simulate Ground Plane**
Simulate a ground plane, adding shadows at the base of the model

### **Retain Texture Transparency**
Preserve the original transparency of textures

### **Sample Texture Transparency**
Consider texture transparency when calculating occlusion (slower but more accurate)

# Credit and Acknowledgments

Code by Kai Salmon.

Massive performance gains were achieved by using [ThreeJS Bounding Volume Heiarachies 
](https://github.com/gkjohnson/three-mesh-bvh) by Garrett Johnson. 


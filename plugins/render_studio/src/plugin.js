Plugin.register('render_studio',{
  title:'Render Studio',author:'shady',description:'Real Three.js lighting, cameras, shadows, tiled high-resolution PNG rendering, and Minecraft-aware materials in a dedicated Blockbench Render workspace.',icon:'icon.png',version:RenderStudio.VERSION,min_version:'5.1.0',variant:'both',tags:['Minecraft','Render','Lighting'],
  onload(){try{RenderStudio.installPersistence();RenderStudio.installUI();console.info('[Render Studio] loaded with isolated Three.js render scene');}catch(error){RenderStudio.removePersistence();RenderStudio.removeUI();throw error;}},
  onunload(){RenderStudio.removePersistence();RenderStudio.removeUI();RenderStudio.projects.clear();RenderStudio.fingerprints.clear();RenderStudio.lastResult=null;}
});

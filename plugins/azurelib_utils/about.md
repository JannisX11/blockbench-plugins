Download the mod library here on [CurseForge](https://www.curseforge.com/minecraft/mc-mods/azurelib) and [Modrinth](https://modrinth.com/mod/azurelib). 

Wiki found here: https://wiki.azuredoom.com/

Supported Minecraft versions: 
- **1.16.5 Forge/Fabric**
- **1.17.1 Forge/Fabric**
- **1.18.2 Forge/Fabric**
- **1.19.2 Forge/Fabric**
- **1.19.4 Forge/Fabric**
- **1.20.1 Forge/NeoForge/Fabric**
- **1.20.4 NeoForge/Fabric**

To add to your code, please do the following: 

```gradle
repositories {
  // The Maven with the mods source
  maven { url 'https://libs.azuredoom.com:4443/mods' }
}

dependencies {
  //Fabric or Quilt
  modImplementation "mod.azure.azurelib:azurelib-fabric-MCVER:MODVER"
 
  //Forge
  implementation fg.deobf("mod.azure.azurelib:azurelib-forge-MCVER:MODVER")
 
  //NeoForge 1.20.1
  implementation fg.deobf("mod.azure.azurelib:azurelib-neo-MCVER:MODVER")
  
  //NeoForge 1.20.4+
  implementation "mod.azure.azurelib:azurelib-neo-MCVER:MODVER"
}
```
<style>
  #plugin_browser_page pre {
    overflow-x: auto;
  }
</style>

Create animated blocks, items, entity, and armor using the AzureLib library and plugin. This is a fork of Geckolib and cross compatibility will not be promised in the future.

Download the mod library here on [CurseForge](https://www.curseforge.com/minecraft/mc-mods/azurelib) and [Modrinth](https://modrinth.com/mod/azurelib). 

Wiki found here: https://wiki.azuredoom.com/

Supported Minecraft versions: 
- **1.16.5 Forge/Fabric**
- **1.17.1 Forge/Fabric**
- **1.18.2 Forge/Fabric**
- **1.19.2 Forge/Fabric**
- **1.19.3 Forge/Fabric**
- **1.19.4 Forge/Fabric**
- **1.20.1 Forge/NeoForge/Fabric**

To add to your code, please do the following: 

```gradle
repositories {
 // The Maven with the mods source
 maven { url 'https://dl.cloudsmith.io/public/azuredoom-mods/azurelib/maven/' }
}

dependencies {
 //Fabric or Quilt
 modImplementation "mod.azure.azurelib:azurelib-fabric-MCVERSION:MODVERSION"
 
 //Forge
 implementation fg.deobf("mod.azure.azurelib:azurelib-forge-MCVERSION:MODVERSION")
 
 //NeoForge
 implementation fg.deobf("mod.azure.azurelib:azurelib-neo-MCVERSION:MODVERSION")
}
```
<style>
  #plugin_browser_page pre {
    overflow-x: auto;
  }
</style>

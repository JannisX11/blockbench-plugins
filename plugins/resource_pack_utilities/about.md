<div id="about-content">
  <img src="https://ewanhowell.com/assets/images/plugins/resource-pack-utilities/logo.webp" />
  <p>This plugin contains a collection of utilities to assist with resource pack creation.</p>
  <h2>How to use</h2>
  <p>To use this plugin, go <strong>Tools > Resource Pack Utilities</strong>, then select the utility you would like to use.</p>
  <h2>Utilities</h2>
  <ul>
    <li>
      <h3>Animation Combiner</h3>
      <p>Animation Combiner is a tool that combines the textures from a selected folder into an animated spritesheet texture.</p>
    </li>
    <li>
      <h3>Batch Exporter</h3>
      <p>Batch Exporter is a tool that will export every bbmodel file within a folder to an output folder using the selected format.</p>
    </li>
    <li>
      <h3>Chest Converter</h3>
      <p>Chest Converter is a tool that will convert the chest textures between the 1.14 format 1.15 format.</p>
    </li>
    <li>
      <h3>CIT Optimiser</h3>
      <p>CIT Optimiser is a tool that will go through all properties files in an OptiFine CIT folder and optimise them to be as small as possible, removing any unnecessary data.</p>
    </li>
    <li>
      <h3>Clock Generator</h3>
      <p>Clock Generator is a tool that allows you to quickly and easily generate a full set of clock textures from a simple input texture.</p>
    </li>
    <li>
      <h3>CTM Converter</h3>
      <p>CTM Converter is a tool that will convert compact CTM into full CTM or overlay CTM.</p>
    </li>
    <li>
      <h3>Image Resizer</h3>
      <p>Image Resizer is a tool that will go through all images in a folder and resize them, relative to their original size.</p>
    </li>
    <li>
      <h3>JSON Optimiser</h3>
      <p>JSON Optimiser is a tool that will go through all JSON files in a folder and optimise them to be as small as possible, minifying them and removing any unnecessary data.</p>
    </li>
    <li>
      <h3>Lang Stripper</h3>
      <p>Lang Stripper is a tool that will go through all the language files in an resource pack and remove any entries that have not been modified.</p>
    </li>
    <li>
      <h3>Minecraft Title Converter</h3>
      <p>Minecraft Title Converter is a tool that will convert images to be in the the Minecraft title format. This can also convert existing textures between the 1.19 and 1.20 texture formats.</p>
    </li>
    <li>
      <h3>Missing Textures</h3>
      <p>Missing Textures is a tool that will check what textures you have in a resource pack and tell you which ones the resource pack is missing.</p>
    </li>
    <li>
      <h3>Mojang Converter</h3>
      <p>Mojang Converter is a tool that will convert images to be in the the Mojang Studios logo format. This can also convert existing textures between the 1.15 and 1.16 texture formats.</p>
    </li>
    <li>
      <h3>Pack Cleaner</h3>
      <p>Pack Cleaner is a tool that will go through all the files in a resource pack and compare them against the vanilla assets, removing them if they are unmodified.</p>
    </li>
    <li>
      <h3>Pack Creator</h3>
      <p>Pack Creator is a tool that allows you to create template resource packs, as well as get the vanilla textures, models, sounds, etc…</p>
    </li>
    <li>
      <h3>Skin Converter</h3>
      <p>Skin Converter is a tool that will convert Minecraft skins between the classic 64x32 format and the modern 64x64 format.</p>
    </li>
    <li>
      <h3>Sounds Stripper</h3>
      <p>Sounds Stripper is a tool that will go through the sounds.json file in an resource pack and remove any entries that have not been modified.</p>
    </li>
    <li>
      <h3>Wide ⇄ Slim Converter</h3>
      <p>Wide ⇄ Slim Converter is a tool that will convert Minecraft skins between the wide 4px arm format and the slim 3px arm format.</p>
    </li>
  </ul>
</div>
<style>
  .about {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  #about-content {
    overflow-y: auto;
    min-height: 128px;
  }
  #about-content > img {
    width: 100%;
    height: 128px;
    object-fit: contain;
    margin: 16px 0 24px;
    filter: drop-shadow(0 3px 10px #0006);
  }
  #about-content h3 {
    margin-bottom: -4px;
    font-weight: 600;
  }
  #about-markdown-links {
    display: flex;
    justify-content: space-around;
    margin: 20px 20px 0;
  }
  #about-markdown-links > a {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    padding: 5px;
    text-decoration: none;
    flex-grow: 1;
    flex-basis: 0;
    color: var(--color-subtle_text);
    text-align: center;
  }
  #about-markdown-links > a:hover {
    background-color: var(--color-accent);
    color: var(--color-light);
  }
  #about-markdown-links > a > i {
    font-size: 32px;
    width: 100%;
    max-width: initial;
    height: 32px;
    text-align: center;
  }
  #about-markdown-links > a:hover > i {
    color: var(--color-light) !important;
  }
  #about-markdown-links > a > p {
    flex: 1;
    display: flex;
    align-items: center;
    margin: 0;
  }
</style>
<div id="about-markdown-links">
  <a href="https://ewanhowell.com/">
    <i class="material-icons icon" style="color: #33E38E;">language</i>
    <p>By Ewan Howell</p>
  </a>
  <a href="https://discord.ewanhowell.com/">
    <i class="fa_big icon fab fa-discord" style="color: #727FFF;"></i>
    <p>Discord Server</p>
  </a>
  <a href="https://www.youtube.com/playlist?list=PLYMG6bVBIumJWFq1MVbubz86XfdGApan3">
    <i class="fa_big icon fab fa-youtube" style="color: #FF4444;"></i>
    <p>Tutorials</p>
  </a>
</div>
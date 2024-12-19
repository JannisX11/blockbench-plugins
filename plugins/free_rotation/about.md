<div id="about-content">
  <p>This format is designed to create <strong>Minecraft: Java Edition</strong> item models without the rotation limitations imposed by the game.</p>
  <p>These models cannot be re-imported, so make sure to save your project as a <strong>bbmodel</strong>.</p>
  <p>This format requires <strong>Minecraft 1.21.4</strong> or later.</p>
  <h2 class="markdown">Usage:</h2>
  <p>To use this plugin, start by creating a new model, or converting an existing cube based project into this format.</p>
  <p>Configure the display settings. These will be respected as long as the size limits are not reached.</p>
  <p>Use <strong>File > Export > Free Rotation Item</strong> to export your model into your resource pack.</p>
  <p>When exporting, select which display slots you would like to export. The more you export, the larger the file size, so only export what you need.</p>
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
  <a href="https://github.com/Godlander">
    <i class="fa_big icon fab fa-github" style="color: #6E40C9;"></i>
    <p>By Godlander</p>
  </a>
  <a href="https://discord.gg/2s6th9SvZd">
    <i class="fa_big icon fab fa-discord" style="color: #727FFF;"></i>
    <p>Godlander's Discord</p>
  </a>
  <a href="https://ewanhowell.com/">
    <i class="material-icons icon" style="color: #33E38E;">language</i>
    <p>By Ewan Howell</p>
  </a>
  <a href="https://discord.ewanhowell.com/">
    <i class="fa_big icon fab fa-discord" style="color: #727FFF;"></i>
    <p>Ewan's Discord</p>
  </a>
</div>
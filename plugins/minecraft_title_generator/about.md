<div id="about-content">
  <img style="width:100%;height:128px;object-fit:contain;margin:0 0 30px;filter:drop-shadow(0 3px 10px #0006)" src="https://ewanhowell.com/assets/images/plugins/minecraft-title-generator/logo.webp" />
  <p>This plugin adds a new format that allows you to create Minecraft-styled title models that you can render in high quality.</p>
  <h2>Getting started</h2>
  <p>To use this plugin, start by creating a new <strong>Minecraft Title</strong> project from the start screen, or go to <strong>File > New > Minecraft Title</strong> You can then use the pop-up dialog to add some text to the project. Don't forget to set the text type! You can add more text by using the <strong>Add Text</strong> button <i class="icon material-icons" style="translate:0 5px">text_fields</i> in the outliner.</p>
  <br><br>
  <p>Once you are done configuring your text, you can go to the <strong>Render</strong> tab at the top right to produce a high-quality render of your title. The <strong>Position Camera</strong> button <i class="icon material-icons" style="translate:0 5px">auto_mode</i> will set the camera angle for you.</p>
</div>
<style>
  .about {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  #about {
    display: none;
  }
  #about-content {
    overflow-y: auto;
    min-height: 128px;
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
<div id="about-markdown-links" style="display:flex;justify-content:space-around;margin:20px 20px 0">
  <a href="https://ewanhowell.com/">
    <i class="material-icons icon" style="color:rgb(51, 227, 142)">language</i>
    <p>By Ewan Howell</p>
  </a>
  <a href="https://discord.ewanhowell.com/">
    <i class="fa_big icon fab fa-discord" style="color:rgb(114, 127, 255)"></i>
    <p>Discord Server</p>
  </a>
  <a href="https://github.com/ewanhowell5195/MinecraftTitleGenerator/">
    <i class="fa_big icon fab fa-github" style="color:rgb(110, 64, 201)"></i>
    <p>Submit Textures and Fonts</p>
  </a>
  <a href="https://youtu.be/iGaufrACVj4">
    <i class="fa_big icon fab fa-youtube" style="color:rgb(255, 68, 68)"></i>
    <p>Tutorial</p>
  </a>
</div>
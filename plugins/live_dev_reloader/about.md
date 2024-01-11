<div id="about-content">
  <p>This plugin adds a way to edit both plugin and theme files in a text editor of your choice, and have them automatically update inside Blockbench upon you saving the file.</p>
  <p>When a plugin file is being watched for changes, it's <strong>about.md</strong> file will be automatically watched for changes too.</p>
  <h2>How to use</h2>
  <h3>Watching files</h3>
  <p>To watch a file, have a theme or plugin file ready, then go to <strong>Help > Developer > Live Dev Reloader</strong>. From here, select <strong>Watch plugin or theme file</strong>, then select your plugin or theme file.</p>
  <h3>Unwatching files</h3>
  <p>To stop watching a file, go to <strong>Help > Developer > Live Dev Reloader</strong> and select <strong>Stop watching plugin or theme file</strong>.</p>
  <h3>Persistent mode</h3>
  <p>To have a plugin or theme continue to be watched next time Blockbench is loaded, enable persistent mode. This can be found at <strong>Help > Developer > Live Dev Reloader > Persist after restart</strong>.</p>
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
</div>
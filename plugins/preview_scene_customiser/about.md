<div id="about-content">
  <h2>How to use</h2>
  <ul>
    <li>Press <strong>Create New Preview Scene</strong> and create a model.</li>
    <li>To export to a file, go to <strong>File > Export > Export Preview Scene</strong>.</li>
    <li>To install directly to Blockbench, go to <strong>File > Export > Install Preview Scene in Blockbench</strong>, and fill in the options.</li>
  </ul>
  <h2>Managing scenes</h2>
  <p>Management options can be found under <strong>View > Preview Scene Customiser</strong>.</p>
  <ul>
    <li>To manage installed scenes, go to <strong>Manage Preview Scenes</strong>.</li>
    <li>To import scene files, go to <strong>Import Preview Scene</strong>, select a scene file, and fill in the options.</li>
    <li>To download pre-made scenes, go to <strong>Download Preview Scenes</strong>.</li>
  </ul>
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
  <a href="https://github.com/ewanhowell5195/previewSceneCustomiser/">
    <i class="fa_big icon fab fa-github" style="color:rgb(110, 64, 201)"></i>
    <p>Submit Preview Scenes</p>
  </a>
</div>
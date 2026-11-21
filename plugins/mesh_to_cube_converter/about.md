<div id="about-content">
  <p>This plugin detects cuboids within meshes and converts them into real Blockbench cubes, including rotated cuboids and meshes made up of multiple merged cubes.</p>
  <p>UVs are transferred exactly. A detected cuboid is only converted when every face maps cleanly onto a cube face, meaning no distorted UVs and no rotations other than 90 degree steps.</p>
  <h2 class="markdown">Usage:</h2>
  <p>Select the meshes you want to convert, or select nothing to convert every mesh in the project.</p>
  <p>Use <strong>Tools &gt; Convert Mesh to Cubes</strong> to run the conversion.</p>
  <p>Valid cuboids are extracted into cubes, and any remaining geometry stays behind as a mesh. Meshes that convert completely are removed.</p>
  <h2 class="markdown">Detection rules:</h2>
  <p>Complete 6 sided cuboids always convert, even when merged into other geometry.</p>
  <p>Partial cuboids with missing faces (such as a hidden face deleted where a slope was merged on) convert when at least 4 faces remain. Missing faces become disabled faces on the cube.</p>
  <p>Isolated geometry that is not attached to anything else converts with any number of faces, so a lone flat plane becomes a zero thickness cube.</p>
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
    <p>Ewan's Discord</p>
  </a>
</div>

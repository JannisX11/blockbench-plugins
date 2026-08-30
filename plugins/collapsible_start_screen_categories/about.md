<div id="about-content">
  <p>This plugin adds a small dropdown arrow next to each category on the start screen, allowing you to collapse each category and hide their respective formats.</p>
</div>
<style>
  .about {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  #about-content {
    overflow-y: auto;
    min-height: 128px;
    display: flex;
    flex-direction: column;
    height: 100%;
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
</div>

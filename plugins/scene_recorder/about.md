<div id="about-content">
  <p>This plugin extends the built-in GIF recorder with a number of new formats to record your model with.</p>
  <p>The new formats can be found inside the GIF recorder. You can find the <strong>Record Gif...</strong> button <i class="icon material-icons" style="translate:0 5px">local_movies</i> under the <strong>View</strong> menu.</p>
  <h2>Formats</h2>
  <table>
    <tr>
      <td>GIF</td>
      <td>Record animated GIFs in higher quality than the built-in GIF format</td>
    </tr>
    <tr>
      <td>MP4 Video</td>
      <td>Record an MP4 video</td>
    </tr>
    <tr>
      <td>MKV Video</td>
      <td>Record an MKV video</td>
    </tr>
    <tr>
      <td>MOV Video</td>
      <td>Record an MOV video</td>
    </tr>
    <tr>
      <td>WebM Video</td>
      <td>Record a WebM video</td>
    </tr>
    <tr>
      <td>Animated WebP</td>
      <td>Record an animated WebP image</td>
    </tr>
    <tr>
      <td>Spritesheet</td>
      <td>Record to a vertically stacked spritesheet texture</td>
    </tr>
  </table>
</div>
<style>
  .about {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .about table {
    width: 100%;
  }
  .about tr:first-child td {
    border-top: none;
  }
  .about td:first-child {
    font-weight: 700;
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
  <a href="https://ffmpeg.org/download.html">
    <svg height="32" viewBox="0 0 70 70"><path fill="none" stroke="#008700" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" d="M5 5h20L5 25v20L45 5h20L5 65h20l40-40v20L45 65h20"/></svg>
    <p>FFmpeg</p>
  </a>
  <a href="https://youtu.be/jZLqNocSQDM">
    <i class="fa_big icon fab fa-youtube" style="color:rgb(255, 68, 68)"></i>
    <p>Installing FFmpeg</p>
  </a>
</div>
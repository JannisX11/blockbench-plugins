<div id="about-content">
  <p>A Blockbench plugin for <strong>Hytale</strong> that loads complete avatar models with automatic texture processing and gradient map application.</p>
  <h3>Features:</h3>
  <ul>
    <li>Automatic avatar loading from Hytale JSON files</li>
    <li>Automatic gradient map application to grayscale textures</li>
    <li>Preserves existing colors (like gold details) while applying gradients only to grayscale areas</li>
    <li>Processes all avatar components (skin, hair, eyes, clothing, accessories) in one operation</li>
  </ul>
  <h3>Usage:</h3>
  <ol>
    <li>Open Blockbench and ensure you're using the Hytale Character format</li>
    <li>Go to <strong>File → Import → Load Hytale Avatar</strong></li>
    <li>Select your avatar JSON file from the CachedPlayerSkins folder</li>
    <li>Select the extracted Assets folder when prompted</li>
  </ol>
  <p><strong>Note:</strong> The plugin requires file system access permissions to function properly.</p>
  <div style="flex: 1;"></div>
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
  #about-content > img {
    width: 100%;
    object-fit: contain;
    margin: 10px 0 12px;
    padding: 0 16px;
    filter: drop-shadow(0 3px 10px #0006);
    pointer-events: none;
    user-select: none;
    image-rendering: auto;
  }
  .author-links {
    display: flex;
    gap: 16px;
    padding: 20px;
    border-top: 1px solid var(--color-border);
    background: var(--color-background);
  }
  .author-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    text-decoration: none;
    flex: 1;
    justify-content: center;
    outline: none !important;
    box-shadow: none !important;
  }
  .author-link:focus,
  .author-link:active,
  .author-link:focus-visible {
    outline: none !important;
    box-shadow: none !important;
    border-color: var(--color-border) !important;
  }
  .author-link i {
    font-size: 24px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .author-link.website i {
    color: #33E38E;
  }
  .author-link.twitter i {
    color: #1DA1F2;
  }
  .author-link span {
    font-size: 14px;
    color: var(--color-text);
    font-weight: 500;
  }
</style>
<div class="author-links">
  <a href="https://pastelito.dev/" class="author-link website">
    <i class="fa_big icon fa-regular fa-copy"></i>
    <span>Website</span>
  </a>
  <a href="https://x.com/MrPastelitoo_" class="author-link twitter">
    <i class="fa_big icon fa-brands fa-x-twitter"></i>
    <span>X (Twitter)</span>
  </a>
</div>

# Bunch o' Screenshots

## TLDR: This plugin allows you to take a screenshots of a bunch of models at a time.
### **Very useful for Java to Bedrock sprite making.**

---
## How to use:

### Save modes:
-  **direct**:
 - (Fastest! Most recommended ;) )
 Directly saves every single screenshot into your computer in the designated output directory (check the plugin's settings for that).
- **justSave**:
 - (Not so fast...)
 Will prompt you a directory selection for every screenshot taken, might be annoying if you have multiple screenshots to take.
- **fullConfirmation**:
 - (Slowest :c)
Will prompt you the default Blockbench screenshot window for every screenshot (with the `Clipboard`, `Save`, `Edit`, `Cancel` buttons), super annoying for multiple screenshots.

### **Steps**
1. Confirm that your settings are fine (most importantly the **output directory**)
2. Open a model (or multiple models at the same time).
3. Use the action button (`Tools > Screenshot all models`) or the hotkey (defaults to `Shift + Alt + S`)

---
## Future features:
- Select output directory with GUI.
- Change width and height of the output image.
- Friendlier save mode names? maybe if requested.
- Beautify this about section lol

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
</style>
<div id="about-markdown-links" style="display:flex;justify-content:space-around;margin:20px 20px 0">
  <!-- <a href="#">
    <i class="material-icons icon" style="color:rgb(51, 227, 142)">language</i>
    <p>By 0Key</p>
  </a> -->
  <a href="https://discord.gg/tgjdxYzg6T">
    <i class="fa_big icon fab fa-discord" style="color:rgb(114, 127, 255)"></i>
    <p>Discord Server</p>
  </a>
  <a href="https://github.com/ewanhowell5195/MinecraftTitleGenerator/">
    <i class="fa_big icon fab fa-github" style="color:lightgrey"></i>
    <p>By 0Key</p>
  </a>
  <!-- <a href="#">
    <i class="fa_big icon fab fa-youtube" style="color:rgb(255, 68, 68)"></i>
    <p>Tutorial</p>
  </a> -->
</div>
<div hidden>
    <p>Yes, I took big part of this about from Ewan Howell's title generator</p>
</div>

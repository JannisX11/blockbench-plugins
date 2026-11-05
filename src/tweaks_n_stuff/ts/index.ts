import "./languages";
import { VERSION, ID } from "./constants";
import { Tweak, TweakConfig } from "./tweaks/base";
import { Mixins } from "./mixins";
import "./tweaks";
import { chunkDigger } from "./digger";

var deleteables: Deletable[] = [];

BBPlugin.register(ID, {
  title: "Tweaks & Stuff",
  author: "legopitstop",
  icon: "icon.png",
  description: "Adds a few tweaks to Blockbench to make your modeling experience better.",
  has_changelog: true,
  website: "https://lpsmods.dev/bbplugins/tweaks_n_stuff",
  repository: "https://github.com/legopitstop/blockbench-plugins/tree/master/plugins/tweaks_n_stuff",
  variant: "both",
  version: VERSION,
  min_version: "4.8.0",
  tags: ["Blockbench"],
  creation_date: "2024-10-07",
  new_repository_format: true,
  oninstall() {
    Tweak.all.forEach((tweak) => tweak.install());
  },
  onuninstall() {
    Tweak.all.forEach((tweak) => tweak.uninstall());
  },
  onload() {
    Mixins.load();
    TweakConfig.load();
    Tweak.all.forEach((tweak) => tweak.load());
    if (Tweak.all.size == 0) {
      console.warn("No tweaks registered!");
    }
    chunkDigger.onLoad();
  },
  onunload() {
    chunkDigger.onUnload();
    Mixins.unload();
    Tweak.all.forEach((tweak) => tweak.unload());
    deleteables.forEach((d) => d?.delete());
  },
});

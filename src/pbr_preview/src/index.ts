/**
 * @author jasonjgardner
 * @discord jason.gardner
 * @github https://github.com/jasonjgardner
 */
/// <reference types="three" />
/// <reference path="../../../types/index.d.ts" />
/// <reference path="./types.d.ts" />

import { registry, setups, teardowns } from "./constants";
import "./lib/properties";
import "./lib/actions";
import "./lib/tools";
import "./lib/panels";
import { disablePbr } from "./lib/disablePbr";

(() => {
  const onload = () => {
    setups.forEach((setup) => setup());
  };

  const onunload = () => {
    disablePbr();
    teardowns.forEach((teardown) => teardown());
    Object.entries(registry).forEach(([key, value]) => {
      try {
        value?.delete();
      } catch (err) {
        console.warn(`Failed to delete ${key} action:`, err);
      }
    });
  };

  BBPlugin.register("pbr_preview", {
    // @ts-expect-error Version does exist in PluginOptions
    version: "1.1.0",
    title: "PBR Features",
    author: "Jason J. Gardner",
    description:
      "Create RTX/Deferred Rendering textures in Blockbench. Adds support for previewing PBR materials and exporting them in Minecraft-compatible formats.",
    tags: ["PBR", "RTX", "Deferred Rendering"],
    icon: "icon.png",
    variant: "both",
    await_loading: true,
    new_repository_format: true,
    repository: "https://github.com/jasonjgardner/blockbench-plugins",
    has_changelog: true,
    min_version: "4.10.2",
    onload,
    onunload,
  });
})();

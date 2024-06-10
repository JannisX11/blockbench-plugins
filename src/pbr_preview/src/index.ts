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
    title: "PBR Tools",
    author: "Jason J. Gardner",
    description:
      "Create and view PBR materials in Blockbench. Export textures for Java and RenderDragon shaders.",
    tags: ["Minecraft: Java Edition", "Minecraft: Bedrock Edition", "PBR"],
    icon: "icon.png",
    variant: "both",
    await_loading: true,
    repository: "https://github.com/jasonjgardner/blockbench-plugins",
    has_changelog: true,
    min_version: "4.10.3",
    onload,
    onunload,
  });
})();

/**
 * @author jasonjgardner
 * @discord jason.gardner
 * @github https://github.com/jasonjgardner
 */
/// <reference types="three" />
/// <reference types="blockbench-types" />

import { setup, teardown } from './io/formats/usdz'

(() => {
  BBPlugin.register("usd_codec", {
    version: "1.0.0",
    title: "USD Codec",
    author: "Jason J. Gardner",
    description:
      "Export Universal Scene Descriptor (USD) files for use in 3D applications like Blender, Maya, and Houdini.",
    tags: ["Codec","PBR"],
    icon: "icon.png",
    variant: "both",
    await_loading: true,
    repository: "https://github.com/jasonjgardner/blockbench-plugins",
    has_changelog: false,
    min_version: "4.12.1",
    onload: setup,
    onunload: teardown,
  });
})();

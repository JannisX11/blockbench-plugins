import type { IChannel } from "../../types";
import {
  CHANNELS,
  NA_CHANNEL,
  registry,
  setups,
  teardowns,
} from "../../constants";
import {
  applyPbrMaterial,
  debounceApplyPbrMaterial,
} from "../applyPbrMaterial";
import { getSelectedLayer, getSelectedTexture } from "../util";

/**
 * Registry of channel actions\
 * (Not in the same registry as the other actions. Needs its own teardown.)
 */
const channelAssignmentActions: Record<IChannel["id"], Action> = {};

const channelSelectActions: Record<IChannel["id"], Action> = {};

const canShowChannelAssignment = () =>
  Condition({
    modes: ["edit", "paint"],
    selected: {
      texture: true,
    },
    project: true,
    method() {
      const selected = getSelectedTexture();

      if (selected && !selected.material) {
        return true;
      }

      return (
        selected?.material === true &&
        getSelectedLayer() !== null &&
        Modes.paint
      );
    },
  });

const canUnassignChannel = () =>
  Condition({
    modes: ["paint", "edit"],
    selected: {
      texture: true,
    },
    method() {
      const texture = getSelectedTexture();

      if (texture?.material && Modes.edit) {
        // Don't show Action on material textures in edit mode
        return false;
      }

      const layer = getSelectedLayer() ?? texture;

      return layer?.channel && layer.channel !== NA_CHANNEL;
    },
  });

setups.push(() => {
  Object.entries(CHANNELS).forEach(([key, channel]) => {
    channelAssignmentActions[key] = new Action(`assign_channel_${key}`, {
      icon: channel.icon ?? "tv_options_edit_channels",
      name: `Assign to ${channel.label.toLocaleLowerCase()} channel`,
      description: `Assign the selected layer to the ${channel.label} channel`,
      category: "textures",
      condition: canShowChannelAssignment,
      click() {
        const layer =
          TextureLayer.selected ?? (Project ? Project.selected_texture : null);

        if (!layer) {
          return;
        }

        Undo.initEdit({ layers: [layer] });

        layer.extend({ channel: channel.id });

        const texture = layer instanceof TextureLayer ? layer.texture : layer;

        texture.updateChangesAfterEdit();

        if (!Project.pbr_materials[texture.uuid]) {
          Project.pbr_materials[texture.uuid] = {};
        }

        // If the layer uuid is already assigned to another channel, unassign it first
        Object.entries(Project.pbr_materials[texture.uuid]).forEach(
          ([assignedChannel, assignedLayerUuid]) => {
            if (assignedLayerUuid === layer.uuid) {
              delete Project.pbr_materials[texture.uuid][assignedChannel];
              layer.channel = NA_CHANNEL;
            }
          }
        );

        // If the layer uuid is equal to the texture uuid, the texture can not be assigned to any other channels
        if (texture.uuid === layer.uuid) {
          Project.pbr_materials[texture.uuid] = {};
        }

        Project.pbr_materials[texture.uuid][key] = layer.uuid;

        Undo.finishEdit("Change channel assignment");

        Blockbench.showQuickMessage(
          `Assigned "${layer.name}" to ${channel.label} channel`,
          2000
        );

        applyPbrMaterial();
      },
    });

    channelSelectActions[key] = new Action(`select_channel_${key}`, {
      icon: channel.icon ?? "tv_options_edit_channels",
      name: channel.label ?? key,
      description: `Select the ${channel.label} channel`,
      condition: {
        project: true,
        selected: {
          texture: true,
        },
        modes: ["paint", "edit"],
        method() {
          const selected = getSelectedTexture();
          const layers = selected?.layers_enabled
            ? selected.layers
            : Texture.all;

          return layers.some(
            (layer: Texture | TextureLayer) => layer.channel === key
          );
        },
      },
      click() {
        const layers = Texture.selected?.layers_enabled
          ? Texture.selected.layers
          : Texture.all;

        if (!layers || !layers.length) {
          return;
        }

        const layer = layers.find(
          (layer: Texture | TextureLayer) => layer.channel === key
        );

        if (!layer) {
          return;
        }

        Modes.options.paint.select();

        layer.select();
        layer.scrollTo();
      },
    });

    channelSelectActions[key].addLabel(true, () => channel.label ?? key);
  });
});

teardowns.push(() => {
  const actions = [
    ...Object.values(channelAssignmentActions),
    ...Object.values(channelSelectActions),
  ];
  actions.forEach((action) => {
    action.delete();
  });
});

setups.push(() => {
  registry.unassignChannel = new Action("unassign_channel", {
    icon: "cancel",
    name: "Unassign Channel",
    description: "Unassign the selected layer from the channel",
    category: "textures",
    condition: canUnassignChannel,
    click() {
      const layer =
        TextureLayer.selected ?? (Project ? Project.selected_texture : null);

      if (!layer) {
        return;
      }

      Undo.initEdit({ layers: [layer] });

      const texture = layer instanceof TextureLayer ? layer.texture : layer;
      const prevChannel = layer.channel;

      Project.pbr_materials[texture.uuid] = {};

      layer.channel = NA_CHANNEL;

      texture.updateChangesAfterEdit();
      Undo.finishEdit("Unassign channel");

      Blockbench.showQuickMessage(
        `Unassigned "${layer.name}" from ${prevChannel} channel`,
        2000
      );

      debounceApplyPbrMaterial();
    },
  });

  registry.channelMenu = new Menu(
    "channel_menu",
    [
      ...Object.keys(CHANNELS).map((key) => `assign_channel_${key}`),
      ...["unassign_channel"],
    ],
    {
      onOpen() {
        debounceApplyPbrMaterial();
      },
    }
  );

  registry.channelSelectionMenu = new Menu(
    "channel_selection_menu",
    Object.keys(CHANNELS).map((key) => `select_channel_${key}`)
  );

  registry.openChannelMenu = new Action("pbr_channel_menu", {
    name: "Assign to PBR Channel",
    icon: "texture",
    condition: () => canShowChannelAssignment() || canUnassignChannel(),
    click(event) {
      registry.channelMenu?.open(event as MouseEvent);
    },
    children: [
      ...Object.values(channelAssignmentActions),
      registry.unassignChannel,
    ],
  });

  registry.showChannelMenu = new Action("show_channel_menu", {
    icon: "texture",
    name: "Assign to PBR Channel",
    description: "Assign the selected layer to a channel",
    category: "textures",
    condition: canShowChannelAssignment,
    click(event) {
      registry.channelMenu?.open(event as MouseEvent);
    },
  });

  registry.showChannelSelectionMenu = new Action("show_channel_select_menu", {
    icon: "tv_options_edit_channels",
    name: "Select PBR Channel",
    description: "Select a channel to view",
    category: "textures",
    condition: {
      modes: ["edit", "paint"],
      selected: {
        texture: true,
      },
      method() {
        const selected = getSelectedTexture();
        const layers = selected?.layers_enabled ? selected.layers : Texture.all;

        return layers.some((layer: Texture | TextureLayer) =>
          Object.keys(CHANNELS).some((key) => layer.channel === key)
        );
      },
    },
    click(event) {
      registry.channelSelectionMenu?.open(event as MouseEvent);
    },
  });

  if (registry.openChannelMenu) {
    MenuBar.addAction(registry.openChannelMenu, "image.0");
    Texture.prototype.menu.addAction(registry.openChannelMenu, "0");
    TextureLayer.prototype.menu.addAction(registry.openChannelMenu, "0");
  }

  Toolbars.layers.add(registry.showChannelMenu, 1);
});

teardowns.push(() => {
  MenuBar.removeAction("image.pbr_channel_menu");
  Texture.prototype.menu.removeAction("pbr_channel_menu");
  TextureLayer.prototype.menu.removeAction("pbr_channel_menu");
  Toolbars.layers.remove(registry.showChannelMenu);
});

import type { IChannel } from "../../types";
import {
  CHANNELS,
  NA_CHANNEL,
  registry,
  setups,
  teardowns,
} from "../../constants";
import { applyPbrMaterial } from "../applyPbrMaterial";

const channelActions: Record<IChannel["id"], Action> = {};

setups.push(() => {
  Object.entries(CHANNELS).forEach(([key, channel]) => {
    channelActions[key] = new Action(`assign_channel_${key}`, {
      icon: channel.icon ?? "tv_options_edit_channels",
      name: `Assign to ${channel.label.toLocaleLowerCase()} channel`,
      description: `Assign the selected layer to the ${channel.label} channel`,
      category: "textures",
      condition: {
        selected: {
          texture: true,
        },
      },
      click(e) {
        const layer =
          TextureLayer.selected ?? (Project ? Project.selected_texture : null);

        if (!layer || !Project) {
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
  });
});

teardowns.push(() => {
  Object.entries(channelActions).forEach(([key, action]) => {
    action?.delete();
  });
});

setups.push(() => {
  registry.unassignChannel = new Action("unassign_channel", {
    icon: "cancel",
    name: "Unassign Channel",
    description: "Unassign the selected layer from the channel",
    category: "textures",
    condition: {
      selected: {
        texture: true,
      },
      method() {
        const layer =
          TextureLayer.selected ?? (Project ? Project.selected_texture : null);

        if (!layer || !Project) {
          return false;
        }

        return layer.channel && layer.channel !== NA_CHANNEL;
      },
    },
    click() {
      const layer =
        TextureLayer.selected ?? (Project ? Project.selected_texture : null);

      if (!layer || !Project) {
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

      applyPbrMaterial();
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
        applyPbrMaterial();
      },
    }
  );

  registry.openChannelMenu = new Action("pbr_channel_menu", {
    name: "Assign to PBR Channel",
    icon: "texture",
    click(event) {
      registry.channelMenu?.open(event as MouseEvent);
    },
    children: [...Object.values(channelActions), registry.unassignChannel],
  });

  registry.showChannelMenu = new Action("show_channel_menu", {
    icon: "texture",
    name: "Assign to PBR Channel",
    description: "Assign the selected layer to a channel",
    category: "textures",
    condition: {
      modes: ["paint"],
      selected: {
        texture: true,
      },
    },
    click(event) {
      registry.channelMenu?.open(event as MouseEvent);
    },
  });
});

setups.push(() => {
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

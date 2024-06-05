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

const isPaintableTexture = Condition(() => {
  return (
    // @ts-expect-error Paint mode exists
    Modes.paint &&
    (TextureLayer.selected || (Project && Project.selected_texture !== null))
  );
});

export function setup() {
  Object.entries(CHANNELS).forEach(([key, channel]) => {
    channelActions[key] = new Action(`assign_channel_${key}`, {
      icon: channel.icon ?? "tv_options_edit_channels",
      name: `Assign to ${channel.label.toLocaleLowerCase()} channel`,
      description: `Assign the selected layer to the ${channel.label} channel`,
      category: "textures",
      condition: isPaintableTexture,
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
          },
        );

        Project.pbr_materials[texture.uuid][key] = layer.uuid;

        Undo.finishEdit("Change channel assignment");

        Blockbench.showQuickMessage(
          `Assigned "${layer.name}" to ${channel.label} channel`,
          2000,
        );

        applyPbrMaterial();
      },
    });
  });
}

export function teardown() {
  Object.entries(channelActions).forEach(([key, action]) => {
    action.delete();
  });
}

setups.push(setup);
teardowns.push(teardown);

setups.push(() => {
  registry.unassignChannel = new Action("unassign_channel", {
    icon: "cancel",
    name: "Unassign Channel",
    description: "Unassign the selected layer from the channel",
    category: "textures",
    condition: () => {
      // @ts-expect-error Paint mode exists
      if (!Modes.paint) {
        return false;
      }

      if (TextureLayer.selected) {
        return (
          TextureLayer.selected.channel !== NA_CHANNEL ||
          !TextureLayer.selected.channel
        );
      }

      if (!Project) {
        return false;
      }

      const texture = Project.selected_texture;

      return (
        texture !== null && texture.channel !== NA_CHANNEL && texture.channel
      );
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
        2000,
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
    },
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
    condition: isPaintableTexture,
    click(event) {
      registry.channelMenu?.open(event as MouseEvent);
    },
  });
});

setups.push(() => {
  if (registry.openChannelMenu) {
    MenuBar.addAction(registry.openChannelMenu, "image.0");
  }
});

teardowns.push(() => {
  MenuBar.removeAction("image.pbr_channel_menu");
});

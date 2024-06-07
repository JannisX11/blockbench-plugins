import type { IChannel } from "../../types";
import { registry, setups, CHANNELS, NA_CHANNEL } from "../../constants";
import { getSelectedLayer, getSelectedTexture } from "../util";

setups.push(() => {
  registry.channelsPanelStyle = Blockbench.addCSS(/* css */ `
    .texture_channel {
      color: var(--color-text);
      flex: 1;
      font-size: 1em;
      margin: 0 0 0 auto;
      padding: 0 8px;
      text-align: right;
    }

    .texture_channel + .texture_particle_icon {
      padding-right: 8px;
    }

    .texture_channel_description {
      background-color: var(--color-back);
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
    }
    
    .texture_channel_wrapper {
      align-items: center;
      background-color: var(--color-ui);
      border-left: 1px solid var(--color-border);
      display: flex;
      flex: 1;
      flex-direction: row;
      align-items: center;
      flex-wrap: nowrap;
      padding: 0 8px;
    }

    .texture_channel_wrapper:hover {
      background-color: var(--color-button);
    }

    .texture_channel_description .texture_name {
      flex-direction: column;
      flex-wrap: nowrap;
      color: var(--color-subtle_text);
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: start;
    }

    .texture_parent {
      color: var(--color-subtle_text);
      font-size: 0.8em;
    }

    .texture_channel_description:hover .texture_channel {
      color: var(--color-accent);
    }

    #pbr_channel_list {
      display: flex;
      flex-direction: column;
    }

    #pbr_channel_list .texture {
      border-top: 1px solid var(--color-border);
      padding-right: 0;
    }
  `);

  registry.channelsPanel = new Panel("channels_panel", {
    name: "PBR Channels",
    id: "channels_panel",
    icon: "gallery_thumbnail",
    display_condition: {
      modes: ["paint", "edit"],
    },
    condition: {
      project: true,
      selected: {
        texture: true,
      },
    },
    toolbars: [
      new Toolbar("channel_assignment_toolbar", {
        id: "channel_assignment_toolbar",
        children: ["create_material_texture", "show_channel_menu"],
        name: "PBR Channel Controls",
      }),
    ],
    component: {
      name: "ChannelsPanel",
      data(): {
        channels: Record<string, IChannel>;
      } {
        return {
          channels: CHANNELS,
        };
      },
      methods: {
        openMenu(event: MouseEvent) {
          registry.channelMenu?.open(event);
        },
        selectTexture(texture: Texture | TextureLayer) {
          Modes.options.paint.select();
          texture.select();
          texture.scrollTo();
        },
        channelEnabled(texture: Texture) {
          return (
            texture.channel &&
            texture.channel !== NA_CHANNEL &&
            texture.channel in this.channels
          );
        },
        getImgSrc(texture: Texture | TextureLayer) {
          return (
            texture.img?.src ??
            `data:image/png;base64,${texture.canvas.toDataURL()}`
          );
        },
      },
      computed: {
        textures() {
          const filterLayers = (layer: Texture | TextureLayer) =>
            layer.visible && layer.channel && layer.channel !== NA_CHANNEL;

          const selectedLayer = getSelectedLayer();

          if (selectedLayer) {
            return selectedLayer.texture.layers.filter(filterLayers);
          }

          const selectedTexture = getSelectedTexture();

          if (!selectedTexture) {
            return [];
          }

          return selectedTexture.layers_enabled
            ? selectedTexture.layers.filter(filterLayers)
            : Texture.all
                .map((t) =>
                  t.layers_enabled
                    ? [...t.layers.filter(filterLayers)]
                    : [filterLayers(t) ? t : null]
                )
                .flat()
                .filter(Boolean);
        },
      },
      template: /* html */ `
      <div>
        <ul class="list mobile_scrollbar" id="pbr_channel_list">
          <li
            v-for="texture in textures"
            v-on:click.stop="selectTexture(texture)"
            v-on:dblclick="openMenu($event)"
            :key="texture.uuid"
            class="texture"
          >
            <img :src="getImgSrc(texture)" :alt="texture.name" width="48" height="48" />
            <div class="texture_description_wrapper texture_channel_description">
              <div class="texture_name">
                <div>{{ texture.name }}</div>
                <div v-if="texture && texture.texture" class="texture_parent">
                  {{ texture.texture.name }}
                </div>
              </div>
              <div v-if="channelEnabled(texture)" class="texture_channel_wrapper">
                <div class="texture_channel">{{ channels[texture.channel].label }}</div>
                <i class="material-icons texture_particle_icon">{{ channels[texture.channel].icon }}</i>
              </div>
            </div>
          </li>
        </ul>
      </div>`,
    },
    expand_button: true,
    growable: true,
    onFold() {},
    onResize() {},
    default_side: "left",
    default_position: {
      slot: "left_bar",
      float_position: [0, 0],
      float_size: [400, 300],
      height: 350,
      folded: true,
    },
    insert_after: "layers",
    insert_before: "color",
  });
});

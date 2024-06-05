import { registry, CHANNELS, NA_CHANNEL, setups } from "../constants";

setups.push(() => {
  registry.channelProp = new Property(TextureLayer, "enum", "channel", {
    default: NA_CHANNEL,
    values: Object.keys(CHANNELS).map((key) => CHANNELS[key].id),
    label: "PBR Channel",
    exposed: false,
  });

  registry.textureChannelProp = new Property(Texture, "enum", "channel", {
    default: NA_CHANNEL,
    values: Object.keys(CHANNELS).map((key) => CHANNELS[key].id),
    label: "PBR Channel",
    exposed: false,
  });

  registry.pbrMaterialsProp = new Property(
    ModelProject,
    // @ts-expect-error "object" is a valid type for a property
    "object",
    "pbr_materials",
    {
      default: {},
      exposed: false,
      label: "PBR Materials",
    },
  );

  registry.projectMaterialsProp = new Property(
    ModelProject,
    // @ts-expect-error "object" is a valid type for a property
    "object",
    "bb_materials",
    {
      default: {},
      exposed: false,
      label: "Project Materials",
    },
  );

  registry.projectPbrModeProp = new Property(
    ModelProject,
    "boolean",
    "pbr_active",
    {
      default: false,
      exposed: true,
      values: [],
      label: "PBR Mode",
    },
  );
});

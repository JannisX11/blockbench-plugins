/// <reference types="three" />
/// <reference path="../../../types/index.d.ts" />
import { z } from "zod";
import { createTool, tools } from "@/lib/factories";
import { getProjectTexture, fixCircularReferences } from "@/lib/util";
import { imageContent } from "fastmcp";

createTool("create_texture", {
  description: "Creates a new texture with the given name and size.",
  annotations: {
    title: "Create Texture",
    destructiveHint: true,
    openWorldHint: true,
  },
  parameters: z
    .object({
      name: z.string(),
      width: z.number().min(16).max(4096).default(16),
      height: z.number().min(16).max(4096).default(16),
      data: z
        .string()
        .optional()
        .describe("Path to the image file or data URL."),
      group: z.string().optional(),
      fill_color: z
        .tuple([
          z.number().min(0).max(255).describe("Red channel"),
          z.number().min(0).max(255).describe("Green channel"),
          z.number().min(0).max(255).describe("Blue channel"),
          z.number().default(255).describe("Alpha channel"),
        ])
        .optional()
        .describe("RGBA color to fill the texture."),
      layer_name: z.string().optional().describe("Name of the texture layer. Required if fill_color is set."),
      pbr_channel: z.enum(["color", "normal", "height", "mer"]).optional().describe("PBR channel to use for the texture. Color, normal, height, or Metalness/Emissive/Roughness (MER) map."),
      render_mode: z.enum(["default", "emissive", "additive", "layered"]).optional().default("default").describe("Render mode for the texture. Default, emissive, additive, or layered."),
      render_sides: z.enum(["auto", "front", "double"]).optional().default("auto").describe("Render sides for the texture. Auto, front, or double."),
    })
    .refine((params) => !(params.data && params.fill_color), {
      message: "The 'data' and 'fill_color' properties cannot both be defined.",
      path: ["data", "fill_color"],
    })
    .refine((params) => !(params.fill_color && !params.layer_name), {
      message: "The 'layer_name' property is required when 'fill_color' is set.",
      path: ["layer_name", "fill_color"],
    })
    .refine(({ pbr_channel, group}) =>  (pbr_channel && group) || !pbr_channel, {
      message: "The 'group' property is required when 'pbr_channel' is set.",
      path: ["group", "pbr_channel"],
    }),
  async execute({ name, width, height, data, pbr_channel, fill_color, group, layer_name }) {
    Undo.initEdit({
      elements: [],
      outliner: true,
      collections: [],
    });

    if (pbr_channel && !group) {
      throw new Error("The 'group' property is required when 'pbr_channel' is set.");
    }

    let texture = new Texture({
      folder: "block",
      name,
      width,
      height,
      group,
      pbr_channel,
    });

    if (data) {
      if (data.startsWith("data:image/")) {
        texture = texture.fromDataURL(data);
      } else {
        texture = texture.fromFile({
          name: data.split(/[\/\\]/).pop() || data,
          path: data,
        });
      }
    } else if (fill_color) {
      texture.layers_enabled = true;
      // Create new TextureLayer with fill color
      const layer = new TextureLayer({
        name: layer_name ?? name,
      }, texture);

      layer.ctx.fillStyle = `rgba(${fill_color[0]}, ${fill_color[1]}, ${fill_color[2]}, ${Math.min(1, fill_color[3])})`;
      layer.ctx.fillRect(0, 0, layer.canvas.width, layer.canvas.height);
      layer.ctx.fill();
      layer.ctx.save();

      layer.addForEditing();
      texture.updateLayerChanges();
    }
    
    texture.updateChangesAfterEdit();
    texture.saved = false;
    texture.add();

    Undo.finishEdit("Agent created texture");
    Canvas.updateAll();

    return imageContent({
      url: texture.getDataURL(),
    });
  },
});

createTool("apply_texture", {
  description: "Applies the given texture to the element with the specified ID.",
  annotations: {
    title: "Apply Texture",
    destructiveHint: true,
  },
  parameters: z.object({
    id: z.string().describe("ID or name of the element to apply the texture to."),
    texture: z.string().describe("ID or name of the texture to apply."),
    applyTo: z.enum(["all", "blank", "none"]).describe("Apply texture to element or group.").optional().default("blank"),
  }),
  async execute({ applyTo, id }) {
    Undo.initEdit({
      elements: [],
      outliner: true,
      collections: [],
    });

    const element = Outliner.root.find(
      (el) => el.uuid === id || el.name === id
    );

    if (!element) {
      throw new Error(`Element with ID "${id}" not found.`);
    }

    const projectTexture = getProjectTexture(id) ?? Texture.getDefault();

    if (!projectTexture) {
      throw new Error(`Texture with ID "${id}" not found.`);
    }

    projectTexture.select();

    Texture.selected?.apply(
      applyTo === "none" ? false : applyTo === "all" ? true : "blank",
    )

    projectTexture.updateChangesAfterEdit();

    Undo.finishEdit("Agent applied texture");
    Canvas.updateAll();

    return `Applied texture ${projectTexture.name} to element with ID ${id}`;
  }
});

createTool("remove_element", {
  description: "Removes the element with the given ID.",
  annotations: {
    title: "Remove Element",
    destructiveHint: true,
  },
  parameters: z.object({
    id: z.string().describe("ID or name of the element to remove."),
  }),
  async execute({ id }) {
    Undo.initEdit({
      elements: [],
      outliner: true,
      collections: [],
    });

    const element = Outliner.root.find(
      (el) => el.uuid === id || el.name === id
    );

    if (!element) {
      throw new Error(`Element with ID "${id}" not found.`);
    }

    element.remove();

    Undo.finishEdit("Agent removed element");
    Canvas.updateAll();

    return `Removed element with ID ${id}`;
  },
});

createTool("add_texture_group", {
  description: "Adds a new texture group with the given name.",
  annotations: {
    title: "Add Texture Group",
    destructiveHint: true,
  },
  parameters: z.object({
    name: z.string(),
    textures: z.array(z.string()).optional().describe("Array of texture IDs or names to add to the group."),
    is_material: z.boolean().optional().default(true).describe("Whether the texture group is a PBR material or not."),
  }),
  async execute({ name, textures, is_material }) {
    Undo.initEdit({
      elements: [],
      outliner: true,
      collections: [],
      textures: [],
    });

    const textureGroup = new TextureGroup({
      name,
      is_material,
    }).add();

    if (textures) {
      const textureList = textures
        .map((texture) => getProjectTexture(texture))
        .filter(Boolean);

      if (textureList.length === 0) {
        throw new Error(`No textures found for "${textures}".`);
      }

      textureList.forEach((texture) => {
        texture?.extend({
          group: textureGroup,
        });
      });
    }

    Undo.finishEdit("Agent added texture group");
    Canvas.updateAll();

    return `Added texture group ${textureGroup.name} with ID ${textureGroup.uuid}`;
  },
});

createTool("place_cube", {
  description:
    "Places a cube of the given size at the specified position. Texture and group are optional.",
  annotations: {
    title: "Place Cube",
    destructiveHint: true,
  },
  parameters: z.object({
    elements: z
      .array(
        z.object({
          name: z.string(),
          origin: z.tuple([z.number(), z.number(), z.number()]).describe("Pivot point of the cube."),
          from: z.tuple([z.number(), z.number(), z.number()]).describe("Starting point of the cube."),
          to: z.tuple([z.number(), z.number(), z.number()]).describe("Ending point of the cube."),
          rotation: z.tuple([z.number(), z.number(), z.number()]).describe("Rotation of the cube."),
        })
      )
      .min(1)
      .describe("Array of cubes to place."),
    texture: z.string().optional().describe("Texture ID or name to apply to the cube."),
    group: z.string().optional().describe("Group/bone to which the cube belongs."),
    faces: z
      .union([
        z.array(z.enum(["north", "south", "east", "west", "up", "down"])).describe("Array of faces to apply the texture to.",),
        z.boolean().optional().describe("Whether to apply the texture to all faces. Set to `true` to enable auto UV mapping.",),
        z.array(
          z.object({
            face: z.enum(["north", "south", "east", "west", "up", "down"]).describe("Face to apply the texture to.",),
            uv: z.tuple([z.number(), z.number(), z.number(), z.number()]).describe("Custom UV mapping for the face.",),
          })
        ).describe("Array of faces with custom UV mapping.",),
      ])
      .optional()
      .default(true)
      .describe("Faces to apply the texture to. Set to `true` to enable auto UV mapping."),
  }),
  async execute({ elements, texture, faces, group }, { reportProgress }) {
    Undo.initEdit({
      elements: [],
      outliner: true,
      collections: [],
    });
    const total = elements.length;

    const projectTexture = texture
      ? getProjectTexture(texture)
      : Texture.getDefault();

    if (!projectTexture) {
      throw new Error(`No texture found for "${texture}".`);
    }

    const groups = getAllGroups();
    const outlinerGroup = groups.find(
      (g) => g.name === group || g.uuid === group
    );

    const autouv =
      faces === true ||
      (Array.isArray(faces) && faces.every((face) => typeof face === "string"));

    const cubes = elements.map((element, progress) => {
      const cube = new Cube({
        autouv: autouv ? 1 : 0,
        name: element.name,
        from: element.from,
        to: element.to,
        origin: element.origin,
        rotation: element.rotation,
      }).init();

      cube.addTo(outlinerGroup);

      if (!autouv && Array.isArray(faces)) {
        faces.forEach(({ face, uv }) => {
          cube.faces[face].extend({
            uv,
          });
        });
      } else {
        cube.applyTexture(projectTexture, faces !== false ? faces : undefined);
        cube.mapAutoUV();
      }

      reportProgress({
        progress,
        total,
      });

      return cube;
    });

    Undo.finishEdit("Agent placed cubes");
    Canvas.updateAll();

    return await Promise.resolve(
      JSON.stringify(
        cubes.map((cube) => `Added cube ${cube.name} with ID ${cube.uuid}`)
      )
    );
  },
});

createTool("modify_cube", {
  description:
    "Modifies the cube with the given ID. Auto UV setting: saved as an integer, where 0 means disabled, 1 means enabled, and 2 means relative auto UV (cube position affects UV)",
  annotations: {
    title: "Modify Cube",
    destructiveHint: true,
  },
  parameters: z.object({
    id: z.string(),
    name: z.string().optional(),
    origin: z.tuple([z.number(), z.number(), z.number()]).optional(),
    from: z.tuple([z.number(), z.number(), z.number()]).optional(),
    to: z.tuple([z.number(), z.number(), z.number()]).optional(),
    rotation: z.tuple([z.number(), z.number(), z.number()]).optional(),
    autouv: z.enum(["0", "1", "2"]).optional().describe("Auto UV setting. 0 = disabled, 1 = enabled, 2 = relative auto UV."),
    uv_offset: z.tuple([z.number(), z.number()]).optional().describe("UV offset for the texture."),
    mirror_uv: z.boolean().optional().describe("Whether to mirror the UVs."),
    shade: z.boolean().optional().describe("Whether to apply shading to the cube."),
    inflate: z.number().optional().describe("Inflation amount for the cube."),
    color: z.number().optional().describe("Single digit to represent a color from a palette."),
    visibility: z.boolean().optional().describe("Whether the cube is visible or not."),
  }),
  async execute({
    id,
    name,
    origin,
    from,
    to,
    rotation,
    uv_offset,
    autouv,
    mirror_uv,
    shade,
    inflate,
    color,
    visibility,
  }) {
    const cube = Outliner.root.find(
      (el) => el instanceof Cube && (el.uuid === id || el.name === id)
    ) as Cube;

    if (!cube) {
      throw new Error(`Cube with ID "${id}" not found.`);
    }

    Undo.initEdit({
      elements: [cube],
      outliner: true,
      collections: [],
    });

    cube.extend({
      name: name ?? cube.name,
      origin: origin ?? cube.origin,
      from: from ?? cube.from,
      to: to ?? cube.to,
      rotation: rotation ?? cube.rotation,
      uv_offset: uv_offset ?? cube.uv_offset,
      autouv: autouv ? (Number(autouv) as 0 | 1 | 2) : cube.autouv,
      mirror_uv: Boolean(mirror_uv ?? cube.mirror_uv),
      inflate: inflate ?? cube.inflate,
      color: color ?? cube.color,
      visibility: visibility ?? cube.visibility,
      shade: shade ?? cube.shade,
    });

    Undo.finishEdit("Agent modified cube");
    Canvas.updateAll();

    return `Modified cube ${cube.name} with ID ${cube.uuid}`;
  },
});

createTool("add_group", {
  description: "Adds a new group with the given name and options.",
  annotations: {
    title: "Add Group",
    destructiveHint: true,
  },
  parameters: z.object({
    name: z.string(),
    origin: z.tuple([z.number(), z.number(), z.number()]),
    rotation: z.tuple([z.number(), z.number(), z.number()]),
    parent: z.string().optional().default("root"),
    visibility: z.boolean().optional().default(true),
    autouv: z.enum(["0", "1", "2"]).optional().default("0").describe("Auto UV setting. 0 = disabled, 1 = enabled, 2 = relative auto UV."),
    selected: z.boolean().optional().default(false),
    shade: z.boolean().optional().default(false),
  }),
  async execute({
    name,
    origin,
    rotation,
    parent,
    visibility,
    autouv,
    selected,
    shade,
  }) {
    Undo.initEdit({
      elements: [],
      outliner: true,
      collections: [],
    });

    const group = new Group({
      name,
      origin,
      rotation,
      autouv: Number(autouv) as 0 | 1 | 2,
      visibility: Boolean(visibility),
      selected: Boolean(selected),
      shade: Boolean(shade),
    }).init();

    group.addTo(
      getAllGroups().find((g) => g.name === parent || g.uuid === parent)
    );

    Undo.finishEdit("Agent added group");
    Canvas.updateAll();

    return `Added group ${group.name} with ID ${group.uuid}`;
  },
});

createTool("list_textures", {
  description: "Returns a list of all textures in the Blockbench editor.",
  annotations: {
    title: "List Textures",
    readOnlyHint: true,
  },
  parameters: z.object({}),
  async execute() {
    const textures = Project?.textures ?? Texture.all;

    if (textures.length === 0) {
      return "No textures found.";
    }

    return JSON.stringify(
      textures.map((texture) => ({
        name: texture.name,
        uuid: texture.uuid,
        id: texture.id,
        group: texture.group,
        ...imageContent({ url: texture.getDataURL() }),
      }))
    );
  },
});

createTool("create_project", {
  description: "Creates a new project with the given name and project type.",
  annotations: {
    title: "Create Project",
    destructiveHint: true,
    openWorldHint: true,
  },
  parameters: z.object({
    name: z.string(),
    format: z
      .enum(Object.keys(Formats) as [string, ...string[]])
      .default("bedrock_block"),
  }),
  async execute({ name, format }) {
    const created = newProject(Formats[format]);

    if (!created) {
      throw new Error("Failed to create project.");
    }

    Project!.name = name;

    return `Created project with name "${name}" (UUID: ${Project?.uuid}) and format "${format}".`;
  },
});

createTool("list_outline", {
  description:
    "Returns a list of all groups and their children in the Blockbench editor.",
  annotations: {
    title: "List Outline",
    readOnlyHint: true,
  },
  parameters: z.object({}),
  async execute() {
    const elements = Outliner.elements;

    if (elements.length === 0) {
      return "No elements found.";
    }

    const fixedRefs = fixCircularReferences(elements);
    const outline = JSON.stringify(elements, fixedRefs);
    return outline;
  },
});

createTool("get_texture", {
  description: "Returns the image data of the given texture or default texture.",
  annotations: {
    title: "Get Texture",
    readOnlyHint: true,
  },
  parameters: z.object({
    texture: z.string().optional().describe("Texture ID or name."),
  }),
  async execute({ texture }) {
    if (!texture) {
      return imageContent({ url: Texture.getDefault().getDataURL() });
    }

    const image = getProjectTexture(texture);

    if (!image) {
      throw new Error(`Texture with ID "${texture}" not found.`);
    }

    return imageContent({ url: image.getDataURL() });
  },
});

createTool("capture_screenshot", {
  description: "Returns the image data of the current view.",
  annotations: {
    title: "Capture Screenshot",
    readOnlyHint: true,
    destructiveHint: true,
  },
  parameters: z.object({
    project: z.string().optional().describe("Project name or UUID."),
  }),
  async execute({ project }) {
    const selectedProject =
      Project ??
      ModelProject.all.find(
        (p) => p.name === project || p.uuid === project || p.selected
      )

    if (!selectedProject) {
      throw new Error("No project found in the Blockbench editor.");
    }

    if(selectedProject.select()) {
      selectedProject.updateThumbnail();
    }

    return imageContent({ url: selectedProject.thumbnail });
  },
});

createTool("set_camera_angle", {
  description: "Sets the camera angle to the specified value.",
  annotations: {
    title: "Set Camera Angle",
    destructiveHint: true,
  },
  parameters: z.object({
    angle: z.object({
      position: z.tuple([z.number(), z.number(), z.number()]).describe("Camera position."),
      target: z.tuple([z.number(), z.number(), z.number()]).optional().describe("Camera target position."),
      rotation: z.tuple([z.number(), z.number(), z.number()]).optional().describe("Camera rotation."),
      projection: z.enum(["unset", "orthographic", "perspective"]).describe("Camera projection type."),
    }),
  }),
  async execute({ angle }) {
    const preview = Preview.selected;

    if (!preview) {
      throw new Error("No preview found in the Blockbench editor.");
    }

    preview.loadAnglePreset(angle);

    return `Camera angle set to ${JSON.stringify(angle)}.`;
  },
});

export default tools;

/// <reference types="three" />
/// <reference path="../../../types/index.d.ts" />
import { z } from "zod";
import { createTool, tools } from "@/lib/factories";
import { getProjectTexture } from "@/lib/util";
import { imageContent } from "fastmcp";

createTool({
  name: "place_cube",
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
          origin: z.tuple([z.number(), z.number(), z.number()]),
          from: z.tuple([z.number(), z.number(), z.number()]),
          to: z.tuple([z.number(), z.number(), z.number()]),
          rotation: z.tuple([z.number(), z.number(), z.number()]),
        })
      )
      .min(1),
    texture: z.string().optional(),
    group: z.string().optional(),
    faces: z
      .union([
        z.array(z.enum(["north", "south", "east", "west", "up", "down"])), // Assumes auto uv usage
        z.boolean().optional(),
        z.array(
          z.object({
            face: z.enum(["north", "south", "east", "west", "up", "down"]),
            uv: z.tuple([z.number(), z.number(), z.number(), z.number()]),
          })
        ),
      ])
      .optional()
      .default(true),
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

createTool({
  name: "eval",
  description: "Evaluates the given expression and logs it to the console.",
  annotations: {
    title: "Eval",
    destructiveHint: true,
    openWorldHint: true,
  },
  parameters: z.object({
    code: z.string(),
  }),
  async execute({ code }) {
    try {
      const result = await eval(code);

      if (result !== undefined) {
        return `Code executed successfully. Result: ${JSON.stringify(result)}`;
      }

      return "Code executed successfully, but no result was returned.";
    } catch (error) {
      return `Error executing code: ${error}`;
    }
  },
});

createTool({
  name: "list_textures",
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
      }))
    );
  },
});

createTool({
  name: "get_texture",
  description: "Returns the image data of the given texture.",
  annotations: {
    title: "Get Texture",
    readOnlyHint: true,
  },
  parameters: z.object({
    texture: z.string(),
  }),
  async execute({ texture }) {
    const image = getProjectTexture(texture);

    if (!image) {
      return `No image found for texture "${texture}".`;
    }

    return imageContent({ url: image.getDataURL() });
  },
});

createTool({
  name: "capture_screenshot",
  description: "Returns the image data of the current view.",
  annotations: {
    title: "Capture Screenshot",
    readOnlyHint: true,
    destructiveHint: true,
  },
  parameters: z.object({
    project: z.string().optional(),
  }),
  async execute({ project }) {
    const selectedProject =
      Project ??
      ModelProject.all.find(
        (p) => p.name === project || p.uuid === project || p.selected
      );

    if (!selectedProject) {
      throw new Error("No project found in the Blockbench editor.");
    }

    selectedProject.updateThumbnail();

    return imageContent({ url: selectedProject.thumbnail });
  },
});

createTool({
  name: "set_camera_angle",
  description: "Sets the camera angle to the specified value.",
  annotations: {
    title: "Set Camera Angle",
    destructiveHint: true,
  },
  parameters: z.object({
    angle: z.object({
      position: z.tuple([z.number(), z.number(), z.number()]),
      target: z.tuple([z.number(), z.number(), z.number()]).optional(),
      rotation: z.tuple([z.number(), z.number(), z.number()]).optional(),
      projection: z.enum(["unset", "orthographic", "perspective"]),
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

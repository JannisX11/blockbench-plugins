/// <reference types="three" />
/// <reference path="../../../types/index.d.ts" />
import { z } from "zod";
import { createTool, tools } from "@/lib/factories";
import { getProjectTexture } from "@/lib/util";
import { imageContent } from "fastmcp";

createTool({
  name: "eval",
  description: "Evaluates the given expression and logs it to the console.",
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
  name: "image",
  description: "Returns the image data of the given texture.",
  parameters: z.object({
    texture: z.string(),
  }),
  annotations: {
    readOnlyHint: true,
  },
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
  description:
    "Sets the camera angle to the specified value.\n\nPosition is in the format [x, y, z].\nTarget and rotation are optional.\nProjection can be 'unset', 'orthographic', or 'perspective'.",
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

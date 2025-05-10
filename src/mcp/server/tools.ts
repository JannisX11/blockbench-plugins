/// <reference types="three" />
/// <reference path="../../../types/index.d.ts" />
import { z } from "zod";
import { createTool, tools } from "@/lib/factories";
import { getProjectTexture } from "@/lib/util";
import { imageContent } from "fastmcp";

createTool(
  "eval",
  "Evaluates the given expression and logs it to the console.",
  (server) => {
    server.addTool({
      name: "eval",
      description: "Evaluates the given expression and logs it to the console.",
      parameters: z.object({
        code: z.string(),
      }),
      async execute({ code }) {
        try {
          const result = await eval(code);

          if (result !== undefined) {
            return `Code executed successfully. Result: ${JSON.stringify(
              result
            )}`;
          }

          return "Code executed successfully, but no result was returned.";
        } catch (error) {
          return `Error executing code: ${error}`;
        }
      },
    });
  }
);

createTool(
  "image",
  "Returns the image data of the given texture.",
  (server) => {
    server.addTool({
      name: "image",
      description: "Returns the image data of the given texture.",
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
  }
)

export default tools;
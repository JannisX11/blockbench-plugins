import { three as THREE, jszip as JSZip } from "../../deps";

class USDZExporter {
  async parse(scene: THREE.Scene): Promise<Uint8Array> {
    const zip = new JSZip();
    const modelFileName = "model.usda"; // model file should be first in USDZ archive so we init it here

    zip.file(modelFileName, "");
    let output: string | null = buildHeader();
    const materials: Record<string, THREE.Material> = {};
    const textures: Record<string, THREE.Texture> = {};
    scene.traverseVisible((object) => {
      if (!(object as THREE.Mesh).isMesh) {
        return;
      }
      const mesh = object as THREE.Mesh;
      if (
        !(mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial
      ) {
        console.warn(
          "THREE.USDZExporter: Unsupported material type (USDZ only supports MeshStandardMaterial)",
          object
        );
        return;
      }
      const geometry = mesh.geometry;
      const material = mesh.material as THREE.MeshStandardMaterial;
      const geometryFileName = "geometries/Geometry_" + geometry.id + ".usd";

      if (!zip.file(geometryFileName)) {
        const meshObject = buildMeshObject(geometry);
        zip.file(geometryFileName, buildUSDFileAsString(meshObject));
      }

      if (!(material.uuid in materials)) {
        materials[material.uuid] = material;
      }

      output += buildXform(mesh, geometry, material);
    });
    output += buildMaterials(materials, textures);
    zip.file(modelFileName, output);
    output = null;

    for (const id in textures) {
      const texture = textures[id];
      const color = id.split("_")[1];
      const isRGBA = texture.format === THREE.RGBAFormat;
      const canvas = imageToCanvas(texture.image, color);
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob(
          (v) => v && resolve(v),
          isRGBA ? "image/png" : "image/jpeg",
          1
        )
      );
      const arrayBuffer = await blob.arrayBuffer();
      zip.file(`textures/Texture_${id}.${isRGBA ? "png" : "jpg"}`, arrayBuffer);
    }

    // 64 byte alignment
    let offset = 0;

    zip.forEach(async (relativePath: string) => {
      const headerSize = 34 + relativePath.length;
      offset += headerSize;
      const offsetMod64 = offset & 63;
      const content = await zip.file(relativePath)!.async("uint8array");

      if (offsetMod64 !== 4) {
        const padLength = 64 - offsetMod64;
        const padding = new Uint8Array(padLength);
        const newContent = new Uint8Array(content.length + padLength);
        newContent.set(content, 0);
        newContent.set(padding, content.length);
        zip.file(relativePath, newContent);
      }

      offset += content.length;
    });

    const zipBlob = await zip.generateAsync({
      type: "blob",
      compression: "STORE",
    });
    return new Uint8Array(await zipBlob.arrayBuffer());
  }
}

function imageToCanvas(
  image: HTMLImageElement | HTMLCanvasElement | OffscreenCanvas | ImageBitmap,
  color?: string
): HTMLCanvasElement {
  if (
    (typeof HTMLImageElement !== "undefined" &&
      image instanceof HTMLImageElement) ||
    (typeof HTMLCanvasElement !== "undefined" &&
      image instanceof HTMLCanvasElement) ||
    (typeof OffscreenCanvas !== "undefined" &&
      image instanceof OffscreenCanvas) ||
    (typeof ImageBitmap !== "undefined" && image instanceof ImageBitmap)
  ) {
    const scale = 1024 / Math.max(image.width, image.height);
    const canvas = document.createElement("canvas");
    canvas.width = image.width * Math.min(1, scale);
    canvas.height = image.height * Math.min(1, scale);
    const context = canvas.getContext("2d")!;

    // Use nearest neighbor for scaling
    context.imageSmoothingEnabled = false;

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    if (color !== undefined) {
      const hex = parseInt(color, 16);
      const r = ((hex >> 16) & 255) / 255;
      const g = ((hex >> 8) & 255) / 255;
      const b = (hex & 255) / 255;
      const imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imagedata.data;

      for (let i = 0; i < data.length; i += 4) {
        data[i + 0] = data[i + 0] * r;
        data[i + 1] = data[i + 1] * g;
        data[i + 2] = data[i + 2] * b;
      }

      context.putImageData(imagedata, 0, 0);
    }

    return canvas;
  }

  throw new Error("Unsupported image type");
}

const PRECISION = 7;

function buildHeader(): string {
  return `#usda 1.0
(
    customLayerData = {
        string creator = "Blockbench USDZExporter"
    }
    metersPerUnit = 1
    upAxis = "Y"
)

`;
}

function buildUSDFileAsString(dataToInsert: string): string {
  let output = buildHeader();
  output += dataToInsert;
  return output;
}

function buildXform(
  object: THREE.Object3D,
  geometry: THREE.BufferGeometry,
  material: THREE.Material
): string {
  const name = "Object_" + object.id;
  const transform = buildMatrix(object.matrixWorld);

  if (object.matrixWorld.determinant() < 0) {
    console.warn(
      "THREE.USDZExporter: USDZ does not support negative scales",
      object
    );
  }

  return `def Xform "${name}" (
    prepend references = @./geometries/Geometry_${geometry.id}.usd@</Geometry>
)
{
    matrix4d xformOp:transform = ${transform}
    uniform token[] xformOpOrder = ["xformOp:transform"]

    rel material:binding = </Materials/Material_${material.id}>
}

`;
}

function buildMatrix(matrix: THREE.Matrix4): string {
  const array = matrix.elements;
  return `( ${buildMatrixRow(array, 0)}, ${buildMatrixRow(array, 4)}, ${buildMatrixRow(array, 8)}, ${buildMatrixRow(array, 12)} )`;
}

function buildMatrixRow(array: number[], offset: number): string {
  return `(${array[offset + 0]}, ${array[offset + 1]}, ${array[offset + 2]}, ${array[offset + 3]})`;
}

function buildMeshObject(geometry: THREE.BufferGeometry): string {
  const mesh = buildMesh(geometry);
  return `
def "Geometry"
{
  ${mesh}
}
`;
}

function buildMesh(geometry: THREE.BufferGeometry): string {
  const name = "Geometry";
  const attributes = geometry.attributes;
  const count = attributes.position.count;
  return `
    def Mesh "${name}"
    {
        int[] faceVertexCounts = [${buildMeshVertexCount(geometry)}]
        int[] faceVertexIndices = [${buildMeshVertexIndices(geometry)}]
        normal3f[] normals = [${buildVector3Array(attributes.normal as THREE.BufferAttribute, count)}] (
            interpolation = "vertex"
        )
        point3f[] points = [${buildVector3Array(attributes.position as THREE.BufferAttribute, count)}]
        float2[] primvars:st = [${buildVector2Array(attributes.uv as THREE.BufferAttribute, count)}] (
            interpolation = "vertex"
        )
        uniform token subdivisionScheme = "none"
    }
`;
}

function buildMeshVertexCount(geometry: THREE.BufferGeometry): string {
  const count =
    geometry.index !== null
      ? geometry.index.count
      : geometry.attributes.position.count;
  return Array(count / 3)
    .fill(3)
    .join(", ");
}

function buildMeshVertexIndices(geometry: THREE.BufferGeometry): string {
  const index = geometry.index;
  const array: number[] = [];

  if (index !== null) {
    for (let i = 0; i < index.count; i++) {
      array.push(index.getX(i));
    }
  } else {
    const length = geometry.attributes.position.count;

    for (let i = 0; i < length; i++) {
      array.push(i);
    }
  }

  return array.join(", ");
}

function buildVector3Array(
  attribute: THREE.BufferAttribute,
  count: number
): string {
  if (attribute === undefined) {
    console.warn("USDZExporter: Normals missing.");
    return Array(count).fill("(0, 0, 0)").join(", ");
  }

  const array: string[] = [];

  for (let i = 0; i < attribute.count; i++) {
    const x = attribute.getX(i);
    const y = attribute.getY(i);
    const z = attribute.getZ(i);
    array.push(
      `(${x.toPrecision(PRECISION)}, ${y.toPrecision(PRECISION)}, ${z.toPrecision(PRECISION)})`
    );
  }

  return array.join(", ");
}

function buildVector2Array(
  attribute: THREE.BufferAttribute,
  count: number
): string {
  if (attribute === undefined) {
    console.warn("USDZExporter: UVs missing.");
    return Array(count).fill("(0, 0)").join(", ");
  }

  const array: string[] = [];

  for (let i = 0; i < attribute.count; i++) {
    const x = attribute.getX(i);
    const y = attribute.getY(i);
    array.push(
      `(${x.toPrecision(PRECISION)}, ${Number(y.toPrecision(PRECISION))})`
    );
  }
  return array.join(", ");
}

function buildMaterials(
  materials: { [key: string]: THREE.Material },
  textures: { [key: string]: THREE.Texture }
): string {
  const array: string[] = [];

  for (const uuid in materials) {
    const material = materials[uuid];
    array.push(buildMaterial(material, textures));
  }

  return `def "Materials"
{
${array.join("")}
}

`;
}

function buildMaterial(
  material: THREE.Material,
  textures: { [key: string]: THREE.Texture }
): string {
  // https://graphics.pixar.com/usd/docs/UsdPreviewSurface-Proposal.html
  const pad = "            ";
  const inputs: string[] = [];
  const samplers: string[] = [];

  function buildTexture(
    texture: THREE.Texture,
    mapType: string,
    color?: THREE.Color
  ): string {
    const id = texture.id + (color ? "_" + color.getHexString() : "");
    const isRGBA = texture.format === THREE.RGBAFormat;
    textures[id] = texture;
    return `
        def Shader "Transform2d_${mapType}" (
            sdrMetadata = {
                string role = "math"
            }
        )
        {
            uniform token info:id = "UsdTransform2d"
            float2 inputs:in.connect = </Materials/Material_${material.id}/uvReader_st.outputs:result>
            float2 inputs:scale = ${buildVector2(texture.repeat)}
            float2 inputs:translation = ${buildVector2(texture.offset)}
            float2 outputs:result
        }

        def Shader "Texture_${texture.id}_${mapType}"
        {
            uniform token info:id = "UsdUVTexture"
            asset inputs:file = @textures/Texture_${id}.${isRGBA ? "png" : "jpg"}@
            float2 inputs:st.connect = </Materials/Material_${material.id}/Transform2d_${mapType}.outputs:result>
            token inputs:wrapS = "repeat"
            token inputs:wrapT = "repeat"
            float outputs:r
            float outputs:g
            float outputs:b
            float3 outputs:rgb
        }`;
  }

  const mat = material as THREE.MeshStandardMaterial;

  if (mat.map !== null) {
    inputs.push(
      `${pad}color3f inputs:diffuseColor.connect = </Materials/Material_${mat.id}/Texture_${mat.map.id}_diffuse.outputs:rgb>`
    );
    samplers.push(buildTexture(mat.map, "diffuse", mat.color));
  } else {
    inputs.push(`${pad}color3f inputs:diffuseColor = ${buildColor(mat.color)}`);
  }

  if (mat.emissiveMap !== null) {
    inputs.push(
      `${pad}color3f inputs:emissiveColor.connect = </Materials/Material_${mat.id}/Texture_${mat.emissiveMap.id}_emissive.outputs:rgb>`
    );
    samplers.push(buildTexture(mat.emissiveMap, "emissive"));
  } else if (mat.emissive.getHex() > 0) {
    inputs.push(
      `${pad}color3f inputs:emissiveColor = ${buildColor(mat.emissive)}`
    );
  }

  if (mat.normalMap !== null) {
    inputs.push(
      `${pad}normal3f inputs:normal.connect = </Materials/Material_${mat.id}/Texture_${mat.normalMap.id}_normal.outputs:rgb>`
    );
    samplers.push(buildTexture(mat.normalMap, "normal"));
  }

  if (mat.aoMap !== null) {
    inputs.push(
      `${pad}float inputs:occlusion.connect = </Materials/Material_${mat.id}/Texture_${mat.aoMap.id}_occlusion.outputs:r>`
    );
    samplers.push(buildTexture(mat.aoMap, "occlusion"));
  }

  if (mat.roughnessMap !== null && mat.roughness === 1) {
    inputs.push(
      `${pad}float inputs:roughness.connect = </Materials/Material_${mat.id}/Texture_${mat.roughnessMap.id}_roughness.outputs:g>`
    );
    samplers.push(buildTexture(mat.roughnessMap, "roughness"));
  } else {
    inputs.push(`${pad}float inputs:roughness = ${mat.roughness}`);
  }

  if (mat.metalnessMap !== null && mat.metalness === 1) {
    inputs.push(
      `${pad}float inputs:metallic.connect = </Materials/Material_${mat.id}/Texture_${mat.metalnessMap.id}_metallic.outputs:b>`
    );
    samplers.push(buildTexture(mat.metalnessMap, "metallic"));
  } else {
    inputs.push(`${pad}float inputs:metallic = ${mat.metalness}`);
  }

  if (mat.alphaMap !== null) {
    inputs.push(
      `${pad}float inputs:opacity.connect = </Materials/Material_${mat.id}/Texture_${mat.alphaMap.id}_opacity.outputs:r>`
    );
    inputs.push(`${pad}float inputs:opacityThreshold = 0.0001`);
    samplers.push(buildTexture(mat.alphaMap, "opacity"));
  } else {
    inputs.push(`${pad}float inputs:opacity = ${mat.opacity}`);
  }

  if ((mat as any).isMeshPhysicalMaterial) {
    const physicalMat = mat as any;
    inputs.push(`${pad}float inputs:clearcoat = ${physicalMat.clearcoat}`);
    inputs.push(
      `${pad}float inputs:clearcoatRoughness = ${physicalMat.clearcoatRoughness}`
    );
    inputs.push(`${pad}float inputs:ior = ${physicalMat.ior}`);
  }

  return `
    def Material "Material_${mat.id}"
    {
        def Shader "PreviewSurface"
        {
            uniform token info:id = "UsdPreviewSurface"
${inputs.join("\n")}
            int inputs:useSpecularWorkflow = 0
            token outputs:surface
        }

        token outputs:surface.connect = </Materials/Material_${mat.id}/PreviewSurface.outputs:surface>
        token inputs:frame:stPrimvarName = "st"

        def Shader "uvReader_st"
        {
            uniform token info:id = "UsdPrimvarReader_float2"
            token inputs:varname.connect = </Materials/Material_${mat.id}.inputs:frame:stPrimvarName>
            float2 inputs:fallback = (0.0, 0.0)
            float2 outputs:result
        }

${samplers.join("\n")}

    }
`;
}

function buildColor(color: THREE.Color): string {
  return `(${color.r}, ${color.g}, ${color.b})`;
}

function buildVector2(vector: THREE.Vector2): string {
  return `(${vector.x}, ${vector.y})`;
}

export default USDZExporter;

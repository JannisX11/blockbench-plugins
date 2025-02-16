class E{async parse(_){let q=new JSZip,K="model.usda";q.file("model.usda","");let k=j(),D={},W={};_.traverseVisible(($)=>{if(!$.isMesh)return;let H=$;if(!H.material.isMeshStandardMaterial){console.warn("THREE.USDZExporter: Unsupported material type (USDZ only supports MeshStandardMaterial)",$);return}let{geometry:Y,material:Q}=H,G="geometries/Geometry_"+Y.id+".usd";if(!q.file(G)){let F=z(Y);q.file(G,R(F))}if(!(Q.uuid in D))D[Q.uuid]=Q;k+=M(H,Y,Q)}),k+=d(D,W),q.file("model.usda",k),k=null;for(let $ in W){let H=W[$],Y=$.split("_")[1],Q=H.format===THREE.RGBAFormat,G=P(H.image,Y),L=await(await new Promise((I)=>G.toBlob((A)=>A&&I(A),Q?"image/png":"image/jpeg",1))).arrayBuffer();q.file(`textures/Texture_${$}.${Q?"png":"jpg"}`,L)}let J=0;q.forEach(async($)=>{let H=34+$.length;J+=H;let Y=J&63,Q=await q.file($)?.async("uint8array");if(!Q)return;if(Y!==4){let G=64-Y,F=new Uint8Array(G),L=new Uint8Array(Q.length+G);L.set(Q,0),L.set(F,Q.length),q.file($,L)}J+=Q.length});let X=await q.generateAsync({type:"blob",compression:"STORE"});return new Uint8Array(await X.arrayBuffer())}}function P(_,q){if(typeof HTMLImageElement!=="undefined"&&_ instanceof HTMLImageElement||typeof HTMLCanvasElement!=="undefined"&&_ instanceof HTMLCanvasElement||typeof OffscreenCanvas!=="undefined"&&_ instanceof OffscreenCanvas||typeof ImageBitmap!=="undefined"&&_ instanceof ImageBitmap){let K=1024/Math.max(_.width,_.height),k=document.createElement("canvas");k.width=_.width*Math.min(1,K),k.height=_.height*Math.min(1,K);let D=k.getContext("2d");if(D.imageSmoothingEnabled=!1,D.drawImage(_,0,0,k.width,k.height),q!==void 0){let W=parseInt(q,16),J=(W>>16&255)/255,X=(W>>8&255)/255,$=(W&255)/255,H=D.getImageData(0,0,k.width,k.height),Y=H.data;for(let Q=0;Q<Y.length;Q+=4)Y[Q+0]=Y[Q+0]*J,Y[Q+1]=Y[Q+1]*X,Y[Q+2]=Y[Q+2]*$;D.putImageData(H,0,0)}return k}throw new Error("Unsupported image type")}var B=7;function j(){return`#usda 1.0
(
    customLayerData = {
        string creator = "Blockbench USDZExporter"
    }
    metersPerUnit = 1
    upAxis = "Y"
)

`}function R(_){let q=j();return q+=_,q}function M(_,q,K){let k="Object_"+_.id,D=T(_.matrixWorld);if(_.matrixWorld.determinant()<0)console.warn("THREE.USDZExporter: USDZ does not support negative scales",_);return`def Xform "${k}" (
    prepend references = @./geometries/Geometry_${q.id}.usd@</Geometry>
)
{
    matrix4d xformOp:transform = ${D}
    uniform token[] xformOpOrder = ["xformOp:transform"]

    rel material:binding = </Materials/Material_${K.id}>
}

`}function T(_){let q=_.elements;return`( ${Z(q,0)}, ${Z(q,4)}, ${Z(q,8)}, ${Z(q,12)} )`}function Z(_,q){return`(${_[q+0]}, ${_[q+1]}, ${_[q+2]}, ${_[q+3]})`}function z(_){return`
def "Geometry"
{
  ${h(_)}
}
`}function h(_){let K=_.attributes,k=K.position.count;return`
    def Mesh "Geometry"
    {
        int[] faceVertexCounts = [${v(_)}]
        int[] faceVertexIndices = [${f(_)}]
        normal3f[] normals = [${U(K.normal,k)}] (
            interpolation = "vertex"
        )
        point3f[] points = [${U(K.position,k)}]
        float2[] primvars:st = [${g(K.uv,k)}] (
            interpolation = "vertex"
        )
        uniform token subdivisionScheme = "none"
    }
`}function v(_){let q=_.index!==null?_.index.count:_.attributes.position.count;return Array(q/3).fill(3).join(", ")}function f(_){let q=_.index,K=[];if(q!==null)for(let k=0;k<q.count;k++)K.push(q.getX(k));else{let k=_.attributes.position.count;for(let D=0;D<k;D++)K.push(D)}return K.join(", ")}function U(_,q){if(_===void 0)return console.warn("USDZExporter: Normals missing."),Array(q).fill("(0, 0, 0)").join(", ");let K=[];for(let k=0;k<_.count;k++){let D=_.getX(k),W=_.getY(k),J=_.getZ(k);K.push(`(${D.toPrecision(B)}, ${W.toPrecision(B)}, ${J.toPrecision(B)})`)}return K.join(", ")}function g(_,q){if(_===void 0)return console.warn("USDZExporter: UVs missing."),Array(q).fill("(0, 0)").join(", ");let K=[];for(let k=0;k<_.count;k++){let D=_.getX(k),W=_.getY(k);K.push(`(${D.toPrecision(B)}, ${Number(W.toPrecision(B))})`)}return K.join(", ")}function d(_,q){let K=[];for(let k in _){let D=_[k];K.push(n(D,q))}return`def "Materials"
{
${K.join("")}
}

`}function n(_,q){let k=[],D=[];function W(X,$,H){let Y=X.id+(H?"_"+H.getHexString():""),Q=X.format===THREE.RGBAFormat;return q[Y]=X,`
        def Shader "Transform2d_${$}" (
            sdrMetadata = {
                string role = "math"
            }
        )
        {
            uniform token info:id = "UsdTransform2d"
            float2 inputs:in.connect = </Materials/Material_${_.id}/uvReader_st.outputs:result>
            float2 inputs:scale = ${N(X.repeat)}
            float2 inputs:translation = ${N(X.offset)}
            float2 outputs:result
        }

        def Shader "Texture_${X.id}_${$}"
        {
            uniform token info:id = "UsdUVTexture"
            asset inputs:file = @textures/Texture_${Y}.${Q?"png":"jpg"}@
            float2 inputs:st.connect = </Materials/Material_${_.id}/Transform2d_${$}.outputs:result>
            token inputs:wrapS = "repeat"
            token inputs:wrapT = "repeat"
            float outputs:r
            float outputs:g
            float outputs:b
            float3 outputs:rgb
        }`}let J=_;if(J.map!==null)k.push(`            color3f inputs:diffuseColor.connect = </Materials/Material_${J.id}/Texture_${J.map.id}_diffuse.outputs:rgb>`),D.push(W(J.map,"diffuse",J.color));else k.push(`            color3f inputs:diffuseColor = ${V(J.color)}`);if(J.emissiveMap!==null)k.push(`            color3f inputs:emissiveColor.connect = </Materials/Material_${J.id}/Texture_${J.emissiveMap.id}_emissive.outputs:rgb>`),D.push(W(J.emissiveMap,"emissive"));else if(J.emissive.getHex()>0)k.push(`            color3f inputs:emissiveColor = ${V(J.emissive)}`);if(J.normalMap!==null)k.push(`            normal3f inputs:normal.connect = </Materials/Material_${J.id}/Texture_${J.normalMap.id}_normal.outputs:rgb>`),D.push(W(J.normalMap,"normal"));if(J.aoMap!==null)k.push(`            float inputs:occlusion.connect = </Materials/Material_${J.id}/Texture_${J.aoMap.id}_occlusion.outputs:r>`),D.push(W(J.aoMap,"occlusion"));if(J.roughnessMap!==null&&J.roughness===1)k.push(`            float inputs:roughness.connect = </Materials/Material_${J.id}/Texture_${J.roughnessMap.id}_roughness.outputs:g>`),D.push(W(J.roughnessMap,"roughness"));else k.push(`            float inputs:roughness = ${J.roughness}`);if(J.metalnessMap!==null&&J.metalness===1)k.push(`            float inputs:metallic.connect = </Materials/Material_${J.id}/Texture_${J.metalnessMap.id}_metallic.outputs:b>`),D.push(W(J.metalnessMap,"metallic"));else k.push(`            float inputs:metallic = ${J.metalness}`);if(J.alphaMap!==null)k.push(`            float inputs:opacity.connect = </Materials/Material_${J.id}/Texture_${J.alphaMap.id}_opacity.outputs:r>`),k.push("            float inputs:opacityThreshold = 0.0001"),D.push(W(J.alphaMap,"opacity"));else k.push(`            float inputs:opacity = ${J.opacity}`);if(J.isMeshPhysicalMaterial){let X=J;k.push(`            float inputs:clearcoat = ${X.clearcoat}`),k.push(`            float inputs:clearcoatRoughness = ${X.clearcoatRoughness}`),k.push(`            float inputs:ior = ${X.ior}`)}return`
    def Material "Material_${J.id}"
    {
        def Shader "PreviewSurface"
        {
            uniform token info:id = "UsdPreviewSurface"
${k.join(`
`)}
            int inputs:useSpecularWorkflow = 0
            token outputs:surface
        }

        token outputs:surface.connect = </Materials/Material_${J.id}/PreviewSurface.outputs:surface>
        token inputs:frame:stPrimvarName = "st"

        def Shader "uvReader_st"
        {
            uniform token info:id = "UsdPrimvarReader_float2"
            token inputs:varname.connect = </Materials/Material_${J.id}.inputs:frame:stPrimvarName>
            float2 inputs:fallback = (0.0, 0.0)
            float2 outputs:result
        }

${D.join(`
`)}

    }
`}function V(_){return`(${_.r}, ${_.g}, ${_.b})`}function N(_){return`(${_.x}, ${_.y})`}var O=E;var w=null;function y(){if(!Project)return pathToName(Texture.selected?.name??"texture");return Project.model_identifier.length>0?Project.model_identifier:Project.getDisplayName()}function C(){let _=new Codec("usdz",{extension:"usdz",name:"USDZ",remember:!0,fileName(){return y()+".usdz"},async compile(q={}){if(!Project)throw new Error("No project loaded");let K=Object.assign(this.export_options??{},q),k=new O,D=new window.THREE.Scene;D.name="blockbench_export",D.add(Project.model_3d);let W=await k.parse(D);return this.dispatchEvent("compile",{model:W,options:K}),Canvas.scene.add(Project.model_3d),W},async export(q={}){let K=await this.compile(q);Blockbench.export({content:K,name:this.fileName(),startpath:this.startPath(),resource_id:"usdz",type:this.name,extensions:["usdz"],savetype:"buffer"},(k)=>this.afterDownload(k))}});w=new Action("export_usdz",{category:"file",name:"Export USDZ",description:"Exports the current model as a USDZ file",icon:"stacks",async click(){if(!_)return;_.export()}}),MenuBar.addAction(w,"file.export")}function S(){MenuBar.removeAction("file.export.export_usdz"),w?.delete()}(()=>{BBPlugin.register("usd_codec",{version:"1.0.0",title:"USD Codec",author:"Jason J. Gardner",description:"Export Universal Scene Descriptor (USD) files for use in 3D applications like Blender, Maya, Houdini, NVIDIA Omniverse, and more.",tags:["Codec","PBR"],icon:"icon.svg",variant:"both",await_loading:!0,repository:"https://github.com/jasonjgardner/blockbench-plugins",has_changelog:!1,min_version:"4.12.1",onload:C,onunload:S})})();

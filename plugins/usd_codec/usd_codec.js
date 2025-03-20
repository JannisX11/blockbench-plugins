class v{async parse(_){let J=new JSZip,Q="model.usda";J.file("model.usda","");let k=M(),K={},W={};_.traverseVisible((X)=>{if(!X.isMesh)return;let Y=X;if(!Y.material.isMeshStandardMaterial){let D=new THREE.MeshStandardMaterial,G=Y.material;D.name=G.name,D.side=G.side,D.transparent=G.transparent,D.opacity=G.opacity;let V=["color","map","normalMap","aoMap","emissive","emissiveMap","roughness","roughnessMap","metalness","metalnessMap","alphaMap","emissiveIntensity"];for(let B of V)if(B in G){let N=G[B];if(N!==void 0){if(N instanceof THREE.Color)D[B].copy(N);else D[B]=N;continue}if(B==="aoMap"){if(D.aoMap=new THREE.Texture,G.normalMap){let R=G.normalMap;if(R.image){let F=document.createElement("canvas"),C=R.image;F.width=C.width||512,F.height=C.height||512;let E=F.getContext("2d");if(E){E.drawImage(C,0,0,F.width,F.height);let I=E.getImageData(0,0,F.width,F.height),U=I.data;for(let A=0;A<U.length;A+=4){let x=U[A+2]/255,S=Math.floor(x*255);U[A]=S,U[A+1]=S,U[A+2]=S}E.putImageData(I,0,0);let z=new THREE.Texture(F);z.needsUpdate=!0,D.aoMap=z,D.aoMapIntensity=1}}}}}Y.material=D}let{geometry:$,material:L}=Y,w="geometries/Geometry_"+$.id+".usd";if(!J.file(w)){let D=s($);J.file(w,c(D))}if(!(L.uuid in K))K[L.uuid]=L;k+=n(Y,$,L)}),k+=i(K,W),J.file("model.usda",k),k=null;let q=J.folder("textures");for(let X in W){let Y=W[X],$=X.split("_")[1],L=Y.format===THREE.RGBAFormat,w=d(Y.image,$),G=await(await new Promise((V)=>w.toBlob((B)=>B&&V(B),L?"image/png":"image/jpeg",1))).arrayBuffer();J.file(`textures/Texture_${X}.${L?"png":"jpg"}`,G)}let H=0;J.forEach(async(X)=>{let Y=34+X.length;H+=Y;let $=H&63,L=await J.file(X).async("uint8array");if($!==4){let w=64-$,D=new Uint8Array(w),G=new Uint8Array(L.length+w);G.set(L,0),G.set(D,L.length),J.file(X,G)}H+=L.length});let Z=await J.generateAsync({type:"blob",compression:"STORE"});return new Uint8Array(await Z.arrayBuffer())}}function d(_,J){if(typeof HTMLImageElement!=="undefined"&&_ instanceof HTMLImageElement||typeof HTMLCanvasElement!=="undefined"&&_ instanceof HTMLCanvasElement||typeof OffscreenCanvas!=="undefined"&&_ instanceof OffscreenCanvas||typeof ImageBitmap!=="undefined"&&_ instanceof ImageBitmap){let Q=1024/Math.max(_.width,_.height),k=document.createElement("canvas");k.width=_.width*Math.min(1,Q),k.height=_.height*Math.min(1,Q);let K=k.getContext("2d");if(K.imageSmoothingEnabled=!1,K.drawImage(_,0,0,k.width,k.height),J!==void 0){let W=parseInt(J,16),q=(W>>16&255)/255,H=(W>>8&255)/255,Z=(W&255)/255,X=K.getImageData(0,0,k.width,k.height),Y=X.data;for(let $=0;$<Y.length;$+=4)Y[$+0]=Y[$+0]*q,Y[$+1]=Y[$+1]*H,Y[$+2]=Y[$+2]*Z;K.putImageData(X,0,0)}return k}throw new Error("Unsupported image type")}var j=7;function M(){return`#usda 1.0
(
    customLayerData = {
        string creator = "Blockbench USDZExporter"
    }
    metersPerUnit = 1
    upAxis = "Y"
)

`}function c(_){let J=M();return J+=_,J}function n(_,J,Q){let k="Object_"+_.id,K=p(_.matrixWorld);if(_.matrixWorld.determinant()<0)console.warn("THREE.USDZExporter: USDZ does not support negative scales",_);return`def Xform "${k}" (
    prepend references = @./geometries/Geometry_${J.id}.usd@</Geometry>
)
{
    matrix4d xformOp:transform = ${K}
    uniform token[] xformOpOrder = ["xformOp:transform"]

    rel material:binding = </Materials/Material_${Q.id}>
}

`}function p(_){let J=_.elements;return`( ${O(J,0)}, ${O(J,4)}, ${O(J,8)}, ${O(J,12)} )`}function O(_,J){return`(${_[J+0]}, ${_[J+1]}, ${_[J+2]}, ${_[J+3]})`}function s(_){return`
def "Geometry"
{
  ${u(_)}
}
`}function u(_){let Q=_.attributes,k=Q.position.count;return`
    def Mesh "Geometry"
    {
        int[] faceVertexCounts = [${l(_)}]
        int[] faceVertexIndices = [${m(_)}]
        normal3f[] normals = [${T(Q.normal,k)}] (
            interpolation = "vertex"
        )
        point3f[] points = [${T(Q.position,k)}]
        float2[] primvars:st = [${o(Q.uv,k)}] (
            interpolation = "vertex"
        )
        uniform token subdivisionScheme = "none"
    }
`}function l(_){let J=_.index!==null?_.index.count:_.attributes.position.count;return Array(J/3).fill(3).join(", ")}function m(_){let J=_.index,Q=[];if(J!==null)for(let k=0;k<J.count;k++)Q.push(J.getX(k));else{let k=_.attributes.position.count;for(let K=0;K<k;K++)Q.push(K)}return Q.join(", ")}function T(_,J){if(_===void 0)return console.warn("USDZExporter: Normals missing."),Array(J).fill("(0, 0, 0)").join(", ");let Q=[];for(let k=0;k<_.count;k++){let K=_.getX(k),W=_.getY(k),q=_.getZ(k);Q.push(`(${K.toPrecision(j)}, ${W.toPrecision(j)}, ${q.toPrecision(j)})`)}return Q.join(", ")}function o(_,J){if(_===void 0)return console.warn("USDZExporter: UVs missing."),Array(J).fill("(0, 0)").join(", ");let Q=[];for(let k=0;k<_.count;k++){let K=_.getX(k),W=_.getY(k);Q.push(`(${K.toPrecision(j)}, ${Number(W.toPrecision(j))})`)}return Q.join(", ")}function i(_,J){let Q=[];for(let k in _){let K=_[k];Q.push(r(K,J))}return`def "Materials"
{
${Q.join("")}
}

`}function r(_,J){let k=[],K=[];function W(H,Z,X){let Y=H.id+(X?"_"+X.getHexString():""),$=H.format===THREE.RGBAFormat;return J[Y]=H,`
        def Shader "Transform2d_${Z}" (
            sdrMetadata = {
                string role = "math"
            }
        )
        {
            uniform token info:id = "UsdTransform2d"
            float2 inputs:in.connect = </Materials/Material_${_.id}/uvReader_st.outputs:result>
            float2 inputs:scale = ${f(H.repeat)}
            float2 inputs:translation = ${f(H.offset)}
            float2 outputs:result
        }

        def Shader "Texture_${H.id}_${Z}"
        {
            uniform token info:id = "UsdUVTexture"
            asset inputs:file = @textures/Texture_${Y}.${$?"png":"jpg"}@
            float2 inputs:st.connect = </Materials/Material_${_.id}/Transform2d_${Z}.outputs:result>
            token inputs:wrapS = "repeat"
            token inputs:wrapT = "repeat"
            float outputs:r
            float outputs:g
            float outputs:b
            float3 outputs:rgb
        }`}let q=_;if(q.map!==null)k.push(`            color3f inputs:diffuseColor.connect = </Materials/Material_${q.id}/Texture_${q.map.id}_diffuse.outputs:rgb>`),K.push(W(q.map,"diffuse",q.color));else k.push(`            color3f inputs:diffuseColor = ${h(q.color)}`);if(q.emissiveMap!==null)k.push(`            color3f inputs:emissiveColor.connect = </Materials/Material_${q.id}/Texture_${q.emissiveMap.id}_emissive.outputs:rgb>`),K.push(W(q.emissiveMap,"emissive"));else if(q.emissive.getHex()>0)k.push(`            color3f inputs:emissiveColor = ${h(q.emissive)}`);if(q.normalMap!==null)k.push(`            normal3f inputs:normal.connect = </Materials/Material_${q.id}/Texture_${q.normalMap.id}_normal.outputs:rgb>`),K.push(W(q.normalMap,"normal"));if(q.aoMap!==null)k.push(`            float inputs:occlusion.connect = </Materials/Material_${q.id}/Texture_${q.aoMap.id}_occlusion.outputs:r>`),K.push(W(q.aoMap,"occlusion"));if(q.roughnessMap!==null&&q.roughness===1)k.push(`            float inputs:roughness.connect = </Materials/Material_${q.id}/Texture_${q.roughnessMap.id}_roughness.outputs:g>`),K.push(W(q.roughnessMap,"roughness"));else k.push(`            float inputs:roughness = ${q.roughness}`);if(q.metalnessMap!==null&&q.metalness===1)k.push(`            float inputs:metallic.connect = </Materials/Material_${q.id}/Texture_${q.metalnessMap.id}_metallic.outputs:b>`),K.push(W(q.metalnessMap,"metallic"));else k.push(`            float inputs:metallic = ${q.metalness}`);if(q.alphaMap!==null)k.push(`            float inputs:opacity.connect = </Materials/Material_${q.id}/Texture_${q.alphaMap.id}_opacity.outputs:r>`),k.push("            float inputs:opacityThreshold = 0.0001"),K.push(W(q.alphaMap,"opacity"));else k.push(`            float inputs:opacity = ${q.opacity}`);if(q.isMeshPhysicalMaterial){let H=q;k.push(`            float inputs:clearcoat = ${H.clearcoat}`),k.push(`            float inputs:clearcoatRoughness = ${H.clearcoatRoughness}`),k.push(`            float inputs:ior = ${H.ior}`)}return`
    def Material "Material_${q.id}"
    {
        def Shader "PreviewSurface"
        {
            uniform token info:id = "UsdPreviewSurface"
${k.join(`
`)}
            int inputs:useSpecularWorkflow = 0
            token outputs:surface
        }

        token outputs:surface.connect = </Materials/Material_${q.id}/PreviewSurface.outputs:surface>
        token inputs:frame:stPrimvarName = "st"

        def Shader "uvReader_st"
        {
            uniform token info:id = "UsdPrimvarReader_float2"
            token inputs:varname.connect = </Materials/Material_${q.id}.inputs:frame:stPrimvarName>
            float2 inputs:fallback = (0.0, 0.0)
            float2 outputs:result
        }

${K.join(`
`)}

    }
`}function h(_){return`(${_.r}, ${_.g}, ${_.b})`}function f(_){return`(${_.x}, ${_.y})`}var g=v;var P=null;function e(){if(!Project)return pathToName(Texture.selected?.name??"texture");return Project.model_identifier.length>0?Project.model_identifier:Project.getDisplayName()}function y(){let _=new Codec("usdz",{extension:"usdz",name:"USDZ",remember:!0,fileName(){return e()+".usdz"},async compile(J={}){if(!Project)throw new Error("No project loaded");let Q=Object.assign(this.export_options??{},J),k=new g,K=new window.THREE.Scene;K.name="blockbench_export",K.add(Project.model_3d);let W=await k.parse(K);return this.dispatchEvent("compile",{model:W,options:Q}),Canvas.scene.add(Project.model_3d),W},async export(J={}){let Q=await this.compile(J);Blockbench.export({content:Q,name:this.fileName(),startpath:this.startPath(),resource_id:"usdz",type:this.name,extensions:["usdz"],savetype:"buffer"},(k)=>this.afterDownload(k))}});P=new Action("export_usdz",{category:"file",name:"Export USDZ",description:"Exports the current model as a USDZ file",icon:"stacks",async click(){if(!_)return;_.export()}}),MenuBar.addAction(P,"file.export")}function b(){MenuBar.removeAction("file.export.export_usdz"),P?.delete()}(()=>{BBPlugin.register("usd_codec",{version:"1.0.0",title:"USD Codec",author:"Jason J. Gardner",description:"Export Universal Scene Descriptor (USD) files for use in 3D applications like Blender, Maya, Houdini, NVIDIA Omniverse, and more.",tags:["Codec","PBR"],icon:"icon.svg",variant:"both",await_loading:!0,repository:"https://github.com/jasonjgardner/blockbench-plugins",has_changelog:!1,min_version:"4.12.1",onload:y,onunload:b})})();

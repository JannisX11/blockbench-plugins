(function() {

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.EffectComposer = function ( renderer, renderTarget ) {

	this.renderer = renderer;

	if ( renderTarget === undefined ) {

		var parameters = {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter,
			format: THREE.RGBAFormat,
			stencilBuffer: false
		};

		var size = renderer.getSize( new THREE.Vector2() );
		this._pixelRatio = renderer.getPixelRatio();
		this._width = size.width;
		this._height = size.height;

		renderTarget = new THREE.WebGLRenderTarget( this._width * this._pixelRatio, this._height * this._pixelRatio, parameters );
		renderTarget.texture.name = 'EffectComposer.rt1';

	} else {

		this._pixelRatio = 1;
		this._width = renderTarget.width;
		this._height = renderTarget.height;

	}

	this.renderTarget1 = renderTarget;
	this.renderTarget2 = renderTarget.clone();
	this.renderTarget2.texture.name = 'EffectComposer.rt2';

	this.writeBuffer = this.renderTarget1;
	this.readBuffer = this.renderTarget2;

	this.renderToScreen = true;

	this.passes = [];

	// dependencies

	if ( THREE.CopyShader === undefined ) {

		console.error( 'THREE.EffectComposer relies on THREE.CopyShader' );

	}

	if ( THREE.ShaderPass === undefined ) {

		console.error( 'THREE.EffectComposer relies on THREE.ShaderPass' );

	}

	this.copyPass = new THREE.ShaderPass( THREE.CopyShader );

	this.clock = new THREE.Clock();

};

Object.assign( THREE.EffectComposer.prototype, {

	swapBuffers: function () {

		var tmp = this.readBuffer;
		this.readBuffer = this.writeBuffer;
		this.writeBuffer = tmp;

	},

	addPass: function ( pass ) {

		this.passes.push( pass );
		pass.setSize( this._width * this._pixelRatio, this._height * this._pixelRatio );

	},

	insertPass: function ( pass, index ) {

		this.passes.splice( index, 0, pass );

	},

	isLastEnabledPass: function ( passIndex ) {

		for ( var i = passIndex + 1; i < this.passes.length; i ++ ) {

			if ( this.passes[ i ].enabled ) {

				return false;

			}

		}

		return true;

	},

	render: function ( deltaTime ) {

		// deltaTime value is in seconds

		if ( deltaTime === undefined ) {

			deltaTime = this.clock.getDelta();

		}

		var currentRenderTarget = this.renderer.getRenderTarget();

		var maskActive = false;

		var pass, i, il = this.passes.length;

		for ( i = 0; i < il; i ++ ) {

			pass = this.passes[ i ];

			if ( pass.enabled === false ) continue;

			pass.renderToScreen = ( this.renderToScreen && this.isLastEnabledPass( i ) );
			pass.render( this.renderer, this.writeBuffer, this.readBuffer, deltaTime, maskActive );

			if ( pass.needsSwap ) {

				if ( maskActive ) {

					var context = this.renderer.getContext();
					var stencil = this.renderer.state.buffers.stencil;

					//context.stencilFunc( context.NOTEQUAL, 1, 0xffffffff );
					stencil.setFunc( context.NOTEQUAL, 1, 0xffffffff );

					this.copyPass.render( this.renderer, this.writeBuffer, this.readBuffer, deltaTime );

					//context.stencilFunc( context.EQUAL, 1, 0xffffffff );
					stencil.setFunc( context.EQUAL, 1, 0xffffffff );

				}

				this.swapBuffers();

			}

			if ( THREE.MaskPass !== undefined ) {

				if ( pass instanceof THREE.MaskPass ) {

					maskActive = true;

				} else if ( pass instanceof THREE.ClearMaskPass ) {

					maskActive = false;

				}

			}

		}

		this.renderer.setRenderTarget( currentRenderTarget );

	},

	reset: function ( renderTarget ) {

		if ( renderTarget === undefined ) {

			var size = this.renderer.getSize( new THREE.Vector2() );
			this._pixelRatio = this.renderer.getPixelRatio();
			this._width = size.width;
			this._height = size.height;

			renderTarget = this.renderTarget1.clone();
			renderTarget.setSize( this._width * this._pixelRatio, this._height * this._pixelRatio );

		}

		this.renderTarget1.dispose();
		this.renderTarget2.dispose();
		this.renderTarget1 = renderTarget;
		this.renderTarget2 = renderTarget.clone();

		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;

	},

	setSize: function ( width, height ) {

		this._width = width;
		this._height = height;

		var effectiveWidth = this._width * this._pixelRatio;
		var effectiveHeight = this._height * this._pixelRatio;

		this.renderTarget1.setSize( effectiveWidth, effectiveHeight );
		this.renderTarget2.setSize( effectiveWidth, effectiveHeight );

		for ( var i = 0; i < this.passes.length; i ++ ) {

			this.passes[ i ].setSize( effectiveWidth, effectiveHeight );

		}

	},

	setPixelRatio: function ( pixelRatio ) {

		this._pixelRatio = pixelRatio;

		this.setSize( this._width, this._height );

	}

} );


THREE.Pass = function () {

	// if set to true, the pass is processed by the composer
	this.enabled = true;

	// if set to true, the pass indicates to swap read and write buffer after rendering
	this.needsSwap = true;

	// if set to true, the pass clears its buffer before rendering
	this.clear = false;

	// if set to true, the result of the pass is rendered to screen. This is set automatically by EffectComposer.
	this.renderToScreen = false;

};

Object.assign( THREE.Pass.prototype, {

	setSize: function ( /* width, height */ ) {},

	render: function ( /* renderer, writeBuffer, readBuffer, deltaTime, maskActive */ ) {

		console.error( 'THREE.Pass: .render() must be implemented in derived pass.' );

	}

} );

// Helper for passes that need to fill the viewport with a single quad.
THREE.Pass.FullScreenQuad = ( function () {

	var camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	var geometry = new THREE.PlaneBufferGeometry( 2, 2 );

	var FullScreenQuad = function ( material ) {

		this._mesh = new THREE.Mesh( geometry, material );

	};

	Object.defineProperty( FullScreenQuad.prototype, 'material', {

		get: function () {

			return this._mesh.material;

		},

		set: function ( value ) {

			this._mesh.material = value;

		}

	} );

	Object.assign( FullScreenQuad.prototype, {

		dispose: function () {

			this._mesh.geometry.dispose();

		},

		render: function ( renderer ) {

			renderer.render( this._mesh, camera );

		}

	} );

	return FullScreenQuad;

} )();




/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

THREE.CopyShader = {

	uniforms: {

		"tDiffuse": { value: null },
		"opacity": { value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

		"	vUv = uv;",
		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float opacity;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

		"	vec4 texel = texture2D( tDiffuse, vUv );",
		"	gl_FragColor = opacity * texel;",

		"}"

	].join( "\n" )

};




/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ShaderPass = function ( shader, textureID ) {

	THREE.Pass.call( this );

	this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

	if ( shader instanceof THREE.ShaderMaterial ) {

		this.uniforms = shader.uniforms;

		this.material = shader;

	} else if ( shader ) {

		this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

		this.material = new THREE.ShaderMaterial( {

			defines: Object.assign( {}, shader.defines ),
			uniforms: this.uniforms,
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader

		} );

	}

	this.fsQuad = new THREE.Pass.FullScreenQuad( this.material );

};

THREE.ShaderPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

	constructor: THREE.ShaderPass,

	render: function ( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

		if ( this.uniforms[ this.textureID ] ) {

			this.uniforms[ this.textureID ].value = readBuffer.texture;

		}

		this.fsQuad.material = this.material;

		if ( this.renderToScreen ) {

			renderer.setRenderTarget( null );
			this.fsQuad.render( renderer );

		} else {

			renderer.setRenderTarget( writeBuffer );
			// TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
			if ( this.clear ) renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );
			this.fsQuad.render( renderer );

		}

	}

} );



/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.RenderPass = function ( scene, camera, overrideMaterial, clearColor, clearAlpha ) {

	THREE.Pass.call( this );

	this.scene = scene;
	this.camera = camera;

	this.overrideMaterial = overrideMaterial;

	this.clearColor = clearColor;
	this.clearAlpha = ( clearAlpha !== undefined ) ? clearAlpha : 0;

	this.clear = true;
	this.clearDepth = false;
	this.needsSwap = false;

};

THREE.RenderPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

	constructor: THREE.RenderPass,

	render: function ( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {

		var oldAutoClear = renderer.autoClear;
		renderer.autoClear = false;

		var oldClearColor, oldClearAlpha, oldOverrideMaterial;

		if ( this.overrideMaterial !== undefined ) {

			oldOverrideMaterial = this.scene.overrideMaterial;

			this.scene.overrideMaterial = this.overrideMaterial;

		}

		if ( this.clearColor ) {

			oldClearColor = renderer.getClearColor().getHex();
			oldClearAlpha = renderer.getClearAlpha();

			renderer.setClearColor( this.clearColor, this.clearAlpha );

		}

		if ( this.clearDepth ) {

			renderer.clearDepth();

		}

		renderer.setRenderTarget( this.renderToScreen ? null : readBuffer );

		// TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
		if ( this.clear ) renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );
		renderer.render( this.scene, this.camera );

		if ( this.clearColor ) {

			renderer.setClearColor( oldClearColor, oldClearAlpha );

		}

		if ( this.overrideMaterial !== undefined ) {

			this.scene.overrideMaterial = oldOverrideMaterial;

		}

		renderer.autoClear = oldAutoClear;

	}

} );


/**
 * TODO
 */

THREE.SAOShader = {
	defines: {
		"NUM_SAMPLES": 7,
		"NUM_RINGS": 4,
		"NORMAL_TEXTURE": 0,
		"DIFFUSE_TEXTURE": 0,
		"DEPTH_PACKING": 1,
		"PERSPECTIVE_CAMERA": 1
	},
	uniforms: {

		"tDepth": { value: null },
		"tDiffuse": { value: null },
		"tNormal": { value: null },
		"size": { value: new THREE.Vector2( 512, 512 ) },

		"cameraNear": { value: 1 },
		"cameraFar": { value: 100 },
		"cameraProjectionMatrix": { value: new THREE.Matrix4() },
		"cameraInverseProjectionMatrix": { value: new THREE.Matrix4() },

		"scale": { value: 1.0 },
		"intensity": { value: 0.1 },
		"bias": { value: 0.5 },

		"minResolution": { value: 0.0 },
		"kernelRadius": { value: 100.0 },
		"randomSeed": { value: 0.0 }
	},
	vertexShader: [
		"varying vec2 vUv;",

		"void main() {",
		"	vUv = uv;",
		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"

	].join( "\n" ),
	fragmentShader: [
		"#include <common>",

		"varying vec2 vUv;",

		"#if DIFFUSE_TEXTURE == 1",
		"uniform sampler2D tDiffuse;",
		"#endif",

		"uniform sampler2D tDepth;",

		"#if NORMAL_TEXTURE == 1",
		"uniform sampler2D tNormal;",
		"#endif",

		"uniform float cameraNear;",
		"uniform float cameraFar;",
		"uniform mat4 cameraProjectionMatrix;",
		"uniform mat4 cameraInverseProjectionMatrix;",

		"uniform float scale;",
		"uniform float intensity;",
		"uniform float bias;",
		"uniform float kernelRadius;",
		"uniform float minResolution;",
		"uniform vec2 size;",
		"uniform float randomSeed;",

		"// RGBA depth",

		"#include <packing>",

		"vec4 getDefaultColor( const in vec2 screenPosition ) {",
		"	#if DIFFUSE_TEXTURE == 1",
		"	return texture2D( tDiffuse, vUv );",
		"	#else",
		"	return vec4( 1.0 );",
		"	#endif",
		"}",

		"float getDepth( const in vec2 screenPosition ) {",
		"	#if DEPTH_PACKING == 1",
		"	return unpackRGBAToDepth( texture2D( tDepth, screenPosition ) );",
		"	#else",
		"	return texture2D( tDepth, screenPosition ).x;",
		"	#endif",
		"}",

		"float getViewZ( const in float depth ) {",
		"	#if PERSPECTIVE_CAMERA == 1",
		"	return perspectiveDepthToViewZ( depth, cameraNear, cameraFar );",
		"	#else",
		"	return orthographicDepthToViewZ( depth, cameraNear, cameraFar );",
		"	#endif",
		"}",

		"vec3 getViewPosition( const in vec2 screenPosition, const in float depth, const in float viewZ ) {",
		"	float clipW = cameraProjectionMatrix[2][3] * viewZ + cameraProjectionMatrix[3][3];",
		"	vec4 clipPosition = vec4( ( vec3( screenPosition, depth ) - 0.5 ) * 2.0, 1.0 );",
		"	clipPosition *= clipW; // unprojection.",

		"	return ( cameraInverseProjectionMatrix * clipPosition ).xyz;",
		"}",

		"vec3 getViewNormal( const in vec3 viewPosition, const in vec2 screenPosition ) {",
		"	#if NORMAL_TEXTURE == 1",
		"	return unpackRGBToNormal( texture2D( tNormal, screenPosition ).xyz );",
		"	#else",
		"	return normalize( cross( dFdx( viewPosition ), dFdy( viewPosition ) ) );",
		"	#endif",
		"}",

		"float scaleDividedByCameraFar;",
		"float minResolutionMultipliedByCameraFar;",

		"float getOcclusion( const in vec3 centerViewPosition, const in vec3 centerViewNormal, const in vec3 sampleViewPosition ) {",
		"	vec3 viewDelta = sampleViewPosition - centerViewPosition;",
		"	float viewDistance = length( viewDelta );",
		"	float scaledScreenDistance = scaleDividedByCameraFar * viewDistance;",

		"	return max(0.0, (dot(centerViewNormal, viewDelta) - minResolutionMultipliedByCameraFar) / scaledScreenDistance - bias) / (1.0 + pow2( scaledScreenDistance ) );",
		"}",

		"// moving costly divides into consts",
		"const float ANGLE_STEP = PI2 * float( NUM_RINGS ) / float( NUM_SAMPLES );",
		"const float INV_NUM_SAMPLES = 1.0 / float( NUM_SAMPLES );",

		"float getAmbientOcclusion( const in vec3 centerViewPosition ) {",
		"	// precompute some variables require in getOcclusion.",
		"	scaleDividedByCameraFar = scale / cameraFar;",
		"	minResolutionMultipliedByCameraFar = minResolution * cameraFar;",
		"	vec3 centerViewNormal = getViewNormal( centerViewPosition, vUv );",

		"	// jsfiddle that shows sample pattern: https://jsfiddle.net/a16ff1p7/",
		"	float angle = rand( vUv + randomSeed ) * PI2;",
		"	vec2 radius = vec2( kernelRadius * INV_NUM_SAMPLES ) / size;",
		"	vec2 radiusStep = radius;",

		"	float occlusionSum = 0.0;",
		"	float weightSum = 0.0;",

		"	for( int i = 0; i < NUM_SAMPLES; i ++ ) {",
		"		vec2 sampleUv = vUv + vec2( cos( angle ), sin( angle ) ) * radius;",
		"		radius += radiusStep;",
		"		angle += ANGLE_STEP;",

		"		float sampleDepth = getDepth( sampleUv );",
		"		if( sampleDepth >= ( 1.0 - EPSILON ) ) {",
		"			continue;",
		"		}",

		"		float sampleViewZ = getViewZ( sampleDepth );",
		"		vec3 sampleViewPosition = getViewPosition( sampleUv, sampleDepth, sampleViewZ );",
		"		occlusionSum += getOcclusion( centerViewPosition, centerViewNormal, sampleViewPosition );",
		"		weightSum += 1.0;",
		"	}",

		"	if( weightSum == 0.0 ) discard;",

		"	return occlusionSum * ( intensity / weightSum );",
		"}",


		"void main() {",
		"	float centerDepth = getDepth( vUv );",
		"	if( centerDepth >= ( 1.0 - EPSILON ) ) {",
		"		discard;",
		"	}",

		"	float centerViewZ = getViewZ( centerDepth );",
		"	vec3 viewPosition = getViewPosition( vUv, centerDepth, centerViewZ );",

		"	float ambientOcclusion = getAmbientOcclusion( viewPosition );",

		"	gl_FragColor = getDefaultColor( vUv );",
		"	gl_FragColor.xyz *=  1.0 - ambientOcclusion;",
		"}"
	].join( "\n" )
};





/**
 * TODO
 */

THREE.DepthLimitedBlurShader = {
	defines: {
		"KERNEL_RADIUS": 4,
		"DEPTH_PACKING": 1,
		"PERSPECTIVE_CAMERA": 1
	},
	uniforms: {
		"tDiffuse": { value: null },
		"size": { value: new THREE.Vector2( 512, 512 ) },
		"sampleUvOffsets": { value: [ new THREE.Vector2( 0, 0 ) ] },
		"sampleWeights": { value: [ 1.0 ] },
		"tDepth": { value: null },
		"cameraNear": { value: 10 },
		"cameraFar": { value: 1000 },
		"depthCutoff": { value: 10 },
	},
	vertexShader: [
		"#include <common>",

		"uniform vec2 size;",

		"varying vec2 vUv;",
		"varying vec2 vInvSize;",

		"void main() {",
		"	vUv = uv;",
		"	vInvSize = 1.0 / size;",

		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"

	].join( "\n" ),
	fragmentShader: [
		"#include <common>",
		"#include <packing>",

		"uniform sampler2D tDiffuse;",
		"uniform sampler2D tDepth;",

		"uniform float cameraNear;",
		"uniform float cameraFar;",
		"uniform float depthCutoff;",

		"uniform vec2 sampleUvOffsets[ KERNEL_RADIUS + 1 ];",
		"uniform float sampleWeights[ KERNEL_RADIUS + 1 ];",

		"varying vec2 vUv;",
		"varying vec2 vInvSize;",

		"float getDepth( const in vec2 screenPosition ) {",
		"	#if DEPTH_PACKING == 1",
		"	return unpackRGBAToDepth( texture2D( tDepth, screenPosition ) );",
		"	#else",
		"	return texture2D( tDepth, screenPosition ).x;",
		"	#endif",
		"}",

		"float getViewZ( const in float depth ) {",
		"	#if PERSPECTIVE_CAMERA == 1",
		"	return perspectiveDepthToViewZ( depth, cameraNear, cameraFar );",
		"	#else",
		"	return orthographicDepthToViewZ( depth, cameraNear, cameraFar );",
		"	#endif",
		"}",

		"void main() {",
		"	float depth = getDepth( vUv );",
		"	if( depth >= ( 1.0 - EPSILON ) ) {",
		"		discard;",
		"	}",

		"	float centerViewZ = -getViewZ( depth );",
		"	bool rBreak = false, lBreak = false;",

		"	float weightSum = sampleWeights[0];",
		"	vec4 diffuseSum = texture2D( tDiffuse, vUv ) * weightSum;",

		"	for( int i = 1; i <= KERNEL_RADIUS; i ++ ) {",

		"		float sampleWeight = sampleWeights[i];",
		"		vec2 sampleUvOffset = sampleUvOffsets[i] * vInvSize;",

		"		vec2 sampleUv = vUv + sampleUvOffset;",
		"		float viewZ = -getViewZ( getDepth( sampleUv ) );",

		"		if( abs( viewZ - centerViewZ ) > depthCutoff ) rBreak = true;",

		"		if( ! rBreak ) {",
		"			diffuseSum += texture2D( tDiffuse, sampleUv ) * sampleWeight;",
		"			weightSum += sampleWeight;",
		"		}",

		"		sampleUv = vUv - sampleUvOffset;",
		"		viewZ = -getViewZ( getDepth( sampleUv ) );",

		"		if( abs( viewZ - centerViewZ ) > depthCutoff ) lBreak = true;",

		"		if( ! lBreak ) {",
		"			diffuseSum += texture2D( tDiffuse, sampleUv ) * sampleWeight;",
		"			weightSum += sampleWeight;",
		"		}",

		"	}",

		"	gl_FragColor = diffuseSum / weightSum;",
		"}"
	].join( "\n" )
};

THREE.BlurShaderUtils = {

	createSampleWeights: function ( kernelRadius, stdDev ) {

		var gaussian = function ( x, stdDev ) {

			return Math.exp( - ( x * x ) / ( 2.0 * ( stdDev * stdDev ) ) ) / ( Math.sqrt( 2.0 * Math.PI ) * stdDev );

		};

		var weights = [];

		for ( var i = 0; i <= kernelRadius; i ++ ) {

			weights.push( gaussian( i, stdDev ) );

		}

		return weights;

	},

	createSampleOffsets: function ( kernelRadius, uvIncrement ) {

		var offsets = [];

		for ( var i = 0; i <= kernelRadius; i ++ ) {

			offsets.push( uvIncrement.clone().multiplyScalar( i ) );

		}

		return offsets;

	},

	configure: function ( material, kernelRadius, stdDev, uvIncrement ) {

		material.defines[ "KERNEL_RADIUS" ] = kernelRadius;
		material.uniforms[ "sampleUvOffsets" ].value = THREE.BlurShaderUtils.createSampleOffsets( kernelRadius, uvIncrement );
		material.uniforms[ "sampleWeights" ].value = THREE.BlurShaderUtils.createSampleWeights( kernelRadius, stdDev );
		material.needsUpdate = true;

	}

};




/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Unpack RGBA depth shader
 * - show RGBA encoded depth as monochrome color
 */

THREE.UnpackDepthRGBAShader = {

	uniforms: {

		"tDiffuse": { value: null },
		"opacity": { value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

		"	vUv = uv;",
		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float opacity;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"#include <packing>",

		"void main() {",

		"	float depth = 1.0 - unpackRGBAToDepth( texture2D( tDiffuse, vUv ) );",
		"	gl_FragColor = vec4( vec3( depth ), opacity );",

		"}"

	].join( "\n" )

};





/**
 * @author ludobaka / ludobaka.github.io
 * SAO implementation inspired from bhouston previous SAO work
 */

THREE.SAOPass = function ( scene, camera, depthTexture, useNormals, resolution ) {

	THREE.Pass.call( this );

	this.scene = scene;
	this.camera = camera;

	this.clear = true;
	this.needsSwap = false;

	this.supportsDepthTextureExtension = ( depthTexture !== undefined ) ? depthTexture : false;
	this.supportsNormalTexture = ( useNormals !== undefined ) ? useNormals : false;

	this.originalClearColor = new THREE.Color();
	this.oldClearColor = new THREE.Color();
	this.oldClearAlpha = 1;

	this.params = {
		output: 0,
		saoBias: 0.5,
		saoIntensity: 0.18,
		saoScale: 1,
		saoKernelRadius: 100,
		saoMinResolution: 0,
		saoBlur: true,
		saoBlurRadius: 8,
		saoBlurStdDev: 4,
		saoBlurDepthCutoff: 0.01
	};

	this.resolution = ( resolution !== undefined ) ? new THREE.Vector2( resolution.x, resolution.y ) : new THREE.Vector2( 256, 256 );

	this.saoRenderTarget = new THREE.WebGLRenderTarget( this.resolution.x, this.resolution.y, {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBAFormat
	} );
	this.blurIntermediateRenderTarget = this.saoRenderTarget.clone();
	this.beautyRenderTarget = this.saoRenderTarget.clone();

	this.normalRenderTarget = new THREE.WebGLRenderTarget( this.resolution.x, this.resolution.y, {
		minFilter: THREE.NearestFilter,
		magFilter: THREE.NearestFilter,
		format: THREE.RGBAFormat
	} );
	this.depthRenderTarget = this.normalRenderTarget.clone();

	if ( this.supportsDepthTextureExtension ) {

		var depthTexture = new THREE.DepthTexture();
		depthTexture.type = THREE.UnsignedShortType;
		depthTexture.minFilter = THREE.NearestFilter;
		depthTexture.maxFilter = THREE.NearestFilter;

		this.beautyRenderTarget.depthTexture = depthTexture;
		this.beautyRenderTarget.depthBuffer = true;

	}

	this.depthMaterial = new THREE.MeshDepthMaterial();
	this.depthMaterial.depthPacking = THREE.RGBADepthPacking;
	this.depthMaterial.blending = THREE.NoBlending;

	this.normalMaterial = new THREE.MeshNormalMaterial();
	this.normalMaterial.blending = THREE.NoBlending;

	if ( THREE.SAOShader === undefined ) {

		console.error( 'THREE.SAOPass relies on THREE.SAOShader' );

	}

	this.saoMaterial = new THREE.ShaderMaterial( {
		defines: Object.assign( {}, THREE.SAOShader.defines ),
		fragmentShader: THREE.SAOShader.fragmentShader,
		vertexShader: THREE.SAOShader.vertexShader,
		uniforms: THREE.UniformsUtils.clone( THREE.SAOShader.uniforms )
	} );
	this.saoMaterial.extensions.derivatives = true;
	this.saoMaterial.defines[ 'DEPTH_PACKING' ] = this.supportsDepthTextureExtension ? 0 : 1;
	this.saoMaterial.defines[ 'NORMAL_TEXTURE' ] = this.supportsNormalTexture ? 1 : 0;
	this.saoMaterial.defines[ 'PERSPECTIVE_CAMERA' ] = this.camera.isPerspectiveCamera ? 1 : 0;
	this.saoMaterial.uniforms[ 'tDepth' ].value = ( this.supportsDepthTextureExtension ) ? depthTexture : this.depthRenderTarget.texture;
	this.saoMaterial.uniforms[ 'tNormal' ].value = this.normalRenderTarget.texture;
	this.saoMaterial.uniforms[ 'size' ].value.set( this.resolution.x, this.resolution.y );
	this.saoMaterial.uniforms[ 'cameraInverseProjectionMatrix' ].value.getInverse( this.camera.projectionMatrix );
	this.saoMaterial.uniforms[ 'cameraProjectionMatrix' ].value = this.camera.projectionMatrix;
	this.saoMaterial.blending = THREE.NoBlending;

	if ( THREE.DepthLimitedBlurShader === undefined ) {

		console.error( 'THREE.SAOPass relies on THREE.DepthLimitedBlurShader' );

	}

	this.vBlurMaterial = new THREE.ShaderMaterial( {
		uniforms: THREE.UniformsUtils.clone( THREE.DepthLimitedBlurShader.uniforms ),
		defines: Object.assign( {}, THREE.DepthLimitedBlurShader.defines ),
		vertexShader: THREE.DepthLimitedBlurShader.vertexShader,
		fragmentShader: THREE.DepthLimitedBlurShader.fragmentShader
	} );
	this.vBlurMaterial.defines[ 'DEPTH_PACKING' ] = this.supportsDepthTextureExtension ? 0 : 1;
	this.vBlurMaterial.defines[ 'PERSPECTIVE_CAMERA' ] = this.camera.isPerspectiveCamera ? 1 : 0;
	this.vBlurMaterial.uniforms[ 'tDiffuse' ].value = this.saoRenderTarget.texture;
	this.vBlurMaterial.uniforms[ 'tDepth' ].value = ( this.supportsDepthTextureExtension ) ? depthTexture : this.depthRenderTarget.texture;
	this.vBlurMaterial.uniforms[ 'size' ].value.set( this.resolution.x, this.resolution.y );
	this.vBlurMaterial.blending = THREE.NoBlending;

	this.hBlurMaterial = new THREE.ShaderMaterial( {
		uniforms: THREE.UniformsUtils.clone( THREE.DepthLimitedBlurShader.uniforms ),
		defines: Object.assign( {}, THREE.DepthLimitedBlurShader.defines ),
		vertexShader: THREE.DepthLimitedBlurShader.vertexShader,
		fragmentShader: THREE.DepthLimitedBlurShader.fragmentShader
	} );
	this.hBlurMaterial.defines[ 'DEPTH_PACKING' ] = this.supportsDepthTextureExtension ? 0 : 1;
	this.hBlurMaterial.defines[ 'PERSPECTIVE_CAMERA' ] = this.camera.isPerspectiveCamera ? 1 : 0;
	this.hBlurMaterial.uniforms[ 'tDiffuse' ].value = this.blurIntermediateRenderTarget.texture;
	this.hBlurMaterial.uniforms[ 'tDepth' ].value = ( this.supportsDepthTextureExtension ) ? depthTexture : this.depthRenderTarget.texture;
	this.hBlurMaterial.uniforms[ 'size' ].value.set( this.resolution.x, this.resolution.y );
	this.hBlurMaterial.blending = THREE.NoBlending;

	if ( THREE.CopyShader === undefined ) {

		console.error( 'THREE.SAOPass relies on THREE.CopyShader' );

	}

	this.materialCopy = new THREE.ShaderMaterial( {
		uniforms: THREE.UniformsUtils.clone( THREE.CopyShader.uniforms ),
		vertexShader: THREE.CopyShader.vertexShader,
		fragmentShader: THREE.CopyShader.fragmentShader,
		blending: THREE.NoBlending
	} );
	this.materialCopy.transparent = true;
	this.materialCopy.depthTest = false;
	this.materialCopy.depthWrite = false;
	this.materialCopy.blending = THREE.CustomBlending;
	this.materialCopy.blendSrc = THREE.DstColorFactor;
	this.materialCopy.blendDst = THREE.ZeroFactor;
	this.materialCopy.blendEquation = THREE.AddEquation;
	this.materialCopy.blendSrcAlpha = THREE.DstAlphaFactor;
	this.materialCopy.blendDstAlpha = THREE.ZeroFactor;
	this.materialCopy.blendEquationAlpha = THREE.AddEquation;

	if ( THREE.UnpackDepthRGBAShader === undefined ) {

		console.error( 'THREE.SAOPass relies on THREE.UnpackDepthRGBAShader' );

	}

	this.depthCopy = new THREE.ShaderMaterial( {
		uniforms: THREE.UniformsUtils.clone( THREE.UnpackDepthRGBAShader.uniforms ),
		vertexShader: THREE.UnpackDepthRGBAShader.vertexShader,
		fragmentShader: THREE.UnpackDepthRGBAShader.fragmentShader,
		blending: THREE.NoBlending
	} );

	this.fsQuad = new THREE.Pass.FullScreenQuad( null );

};

THREE.SAOPass.OUTPUT = {
	'Beauty': 1,
	'Default': 0,
	'SAO': 2,
	'Depth': 3,
	'Normal': 4
};

THREE.SAOPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {
	constructor: THREE.SAOPass,

	render: function ( renderer, writeBuffer, readBuffer/*, deltaTime, maskActive*/ ) {

		// Rendering readBuffer first when rendering to screen
		if ( this.renderToScreen ) {

			this.materialCopy.blending = THREE.NoBlending;
			this.materialCopy.uniforms[ 'tDiffuse' ].value = readBuffer.texture;
			this.materialCopy.needsUpdate = true;
			this.renderPass( renderer, this.materialCopy, null );

		}

		if ( this.params.output === 1 ) {

			return;

		}

		this.oldClearColor.copy( renderer.getClearColor() );
		this.oldClearAlpha = renderer.getClearAlpha();
		var oldAutoClear = renderer.autoClear;
		renderer.autoClear = false;

		renderer.setRenderTarget( this.depthRenderTarget );
		renderer.clear();

		this.saoMaterial.uniforms[ 'bias' ].value = this.params.saoBias;
		this.saoMaterial.uniforms[ 'intensity' ].value = this.params.saoIntensity;
		this.saoMaterial.uniforms[ 'scale' ].value = this.params.saoScale;
		this.saoMaterial.uniforms[ 'kernelRadius' ].value = this.params.saoKernelRadius;
		this.saoMaterial.uniforms[ 'minResolution' ].value = this.params.saoMinResolution;
		this.saoMaterial.uniforms[ 'cameraNear' ].value = this.camera.near;
		this.saoMaterial.uniforms[ 'cameraFar' ].value = this.camera.far;
		// this.saoMaterial.uniforms['randomSeed'].value = Math.random();

		var depthCutoff = this.params.saoBlurDepthCutoff * ( this.camera.far - this.camera.near );
		this.vBlurMaterial.uniforms[ 'depthCutoff' ].value = depthCutoff;
		this.hBlurMaterial.uniforms[ 'depthCutoff' ].value = depthCutoff;

		this.vBlurMaterial.uniforms[ 'cameraNear' ].value = this.camera.near;
		this.vBlurMaterial.uniforms[ 'cameraFar' ].value = this.camera.far;
		this.hBlurMaterial.uniforms[ 'cameraNear' ].value = this.camera.near;
		this.hBlurMaterial.uniforms[ 'cameraFar' ].value = this.camera.far;

		this.params.saoBlurRadius = Math.floor( this.params.saoBlurRadius );
		if ( ( this.prevStdDev !== this.params.saoBlurStdDev ) || ( this.prevNumSamples !== this.params.saoBlurRadius ) ) {

			THREE.BlurShaderUtils.configure( this.vBlurMaterial, this.params.saoBlurRadius, this.params.saoBlurStdDev, new THREE.Vector2( 0, 1 ) );
			THREE.BlurShaderUtils.configure( this.hBlurMaterial, this.params.saoBlurRadius, this.params.saoBlurStdDev, new THREE.Vector2( 1, 0 ) );
			this.prevStdDev = this.params.saoBlurStdDev;
			this.prevNumSamples = this.params.saoBlurRadius;

		}

		// Rendering scene to depth texture
		renderer.setClearColor( 0x000000 );
		renderer.setRenderTarget( this.beautyRenderTarget );
		renderer.clear();
		renderer.render( this.scene, this.camera );

		// Re-render scene if depth texture extension is not supported
		if ( ! this.supportsDepthTextureExtension ) {

			// Clear rule : far clipping plane in both RGBA and Basic encoding
			this.renderOverride( renderer, this.depthMaterial, this.depthRenderTarget, 0x000000, 1.0 );

		}

		if ( this.supportsNormalTexture ) {

			// Clear rule : default normal is facing the camera
			this.renderOverride( renderer, this.normalMaterial, this.normalRenderTarget, 0x7777ff, 1.0 );

		}

		// Rendering SAO texture
		this.renderPass( renderer, this.saoMaterial, this.saoRenderTarget, 0xffffff, 1.0 );

		// Blurring SAO texture
		if ( this.params.saoBlur ) {

			this.renderPass( renderer, this.vBlurMaterial, this.blurIntermediateRenderTarget, 0xffffff, 1.0 );
			this.renderPass( renderer, this.hBlurMaterial, this.saoRenderTarget, 0xffffff, 1.0 );

		}

		var outputMaterial = this.materialCopy;
		// Setting up SAO rendering
		if ( this.params.output === 3 ) {

			if ( this.supportsDepthTextureExtension ) {

				this.materialCopy.uniforms[ 'tDiffuse' ].value = this.beautyRenderTarget.depthTexture;
				this.materialCopy.needsUpdate = true;

			} else {

				this.depthCopy.uniforms[ 'tDiffuse' ].value = this.depthRenderTarget.texture;
				this.depthCopy.needsUpdate = true;
				outputMaterial = this.depthCopy;

			}

		} else if ( this.params.output === 4 ) {

			this.materialCopy.uniforms[ 'tDiffuse' ].value = this.normalRenderTarget.texture;
			this.materialCopy.needsUpdate = true;

		} else {

			this.materialCopy.uniforms[ 'tDiffuse' ].value = this.saoRenderTarget.texture;
			this.materialCopy.needsUpdate = true;

		}

		// Blending depends on output, only want a CustomBlending when showing SAO
		if ( this.params.output === 0 ) {

			outputMaterial.blending = THREE.CustomBlending;

		} else {

			outputMaterial.blending = THREE.NoBlending;

		}

		// Rendering SAOPass result on top of previous pass
		this.renderPass( renderer, outputMaterial, this.renderToScreen ? null : readBuffer );

		renderer.setClearColor( this.oldClearColor, this.oldClearAlpha );
		renderer.autoClear = oldAutoClear;

	},

	renderPass: function ( renderer, passMaterial, renderTarget, clearColor, clearAlpha ) {

		// save original state
		this.originalClearColor.copy( renderer.getClearColor() );
		var originalClearAlpha = renderer.getClearAlpha();
		var originalAutoClear = renderer.autoClear;

		renderer.setRenderTarget( renderTarget );

		// setup pass state
		renderer.autoClear = false;
		if ( ( clearColor !== undefined ) && ( clearColor !== null ) ) {

			renderer.setClearColor( clearColor );
			renderer.setClearAlpha( clearAlpha || 0.0 );
			renderer.clear();

		}

		this.fsQuad.material = passMaterial;
		this.fsQuad.render( renderer );

		// restore original state
		renderer.autoClear = originalAutoClear;
		renderer.setClearColor( this.originalClearColor );
		renderer.setClearAlpha( originalClearAlpha );

	},

	renderOverride: function ( renderer, overrideMaterial, renderTarget, clearColor, clearAlpha ) {

		this.originalClearColor.copy( renderer.getClearColor() );
		var originalClearAlpha = renderer.getClearAlpha();
		var originalAutoClear = renderer.autoClear;

		renderer.setRenderTarget( renderTarget );
		renderer.autoClear = false;

		clearColor = overrideMaterial.clearColor || clearColor;
		clearAlpha = overrideMaterial.clearAlpha || clearAlpha;
		if ( ( clearColor !== undefined ) && ( clearColor !== null ) ) {

			renderer.setClearColor( clearColor );
			renderer.setClearAlpha( clearAlpha || 0.0 );
			renderer.clear();

		}

		this.scene.overrideMaterial = overrideMaterial;
		renderer.render( this.scene, this.camera );
		this.scene.overrideMaterial = null;

		// restore original state
		renderer.autoClear = originalAutoClear;
		renderer.setClearColor( this.originalClearColor );
		renderer.setClearAlpha( originalClearAlpha );

	},

	setSize: function ( width, height ) {

		this.beautyRenderTarget.setSize( width, height );
		this.saoRenderTarget.setSize( width, height );
		this.blurIntermediateRenderTarget.setSize( width, height );
		this.normalRenderTarget.setSize( width, height );
		this.depthRenderTarget.setSize( width, height );

		this.saoMaterial.uniforms[ 'size' ].value.set( width, height );
		this.saoMaterial.uniforms[ 'cameraInverseProjectionMatrix' ].value.getInverse( this.camera.projectionMatrix );
		this.saoMaterial.uniforms[ 'cameraProjectionMatrix' ].value = this.camera.projectionMatrix;
		this.saoMaterial.needsUpdate = true;

		this.vBlurMaterial.uniforms[ 'size' ].value.set( width, height );
		this.vBlurMaterial.needsUpdate = true;

		this.hBlurMaterial.uniforms[ 'size' ].value.set( width, height );
		this.hBlurMaterial.needsUpdate = true;

	}

} );




Plugin.register('ambient_occlusion', {
	title: 'Ambient Occlusion',
	icon: 'gradient',
	author: 'JannisX11',
	description: 'Adds a scalable ambient occlusion shader',
	version: '1.0.2',
	min_version: '3.2.0',
	variant: 'both',
	onload() {

		new Setting('ambient_occlusion_enabled', {
			name: 'Ambient Occlusion',
			description: 'Enable Ambient Occlusion in the Blockbench previews',
			category: 'preview',
			value: 'true',
			onChange: (value) => {
				Preview.all.forEach(preview => {
					if (!value || preview == MediaPreview) return;
					preview.composer.setSize(preview.width, preview.height);
				})
			}
		}) 
		new Setting('ambient_occlusion_intensity', {
			name: 'Ambient Occlusion Intensity',
			description: 'Ambient Occlusion intensity in the Blockbench previews, 50 is the maximum.',
			category: 'preview',
			type: 'number',
			value: 25,
			min: 0,
			max: 50,
			onChange: (value) => {
				value = Math.clamp(value, 0, 50)/100;
				Preview.all.forEach(preview => {
					if (!preview.saoPass || preview == MediaPreview) return;
					preview.saoPass.params.saoIntensity = value;
				})
			}
		})

		function setupPreviewSAO(preview) {

			var this_scene = preview.id == 'display' ? display_scene : scene;

			preview.composer = new THREE.EffectComposer( preview.renderer );
			preview.renderPass = new THREE.RenderPass( this_scene, preview.camPers );
			preview.composer.addPass( preview.renderPass );
			preview.saoPass = new THREE.SAOPass( this_scene, preview.camPers, false, true );
			preview.composer.addPass( preview.saoPass );

			preview.saoPass.params.saoIntensity = 0.25;
			preview.saoPass.params.saoScale = 2900;

		}



		Preview.all.filter(preview => preview != MediaPreview).forEach(setupPreviewSAO)

		Preview.prototype.render = function() {
			if (this.canvas.isConnected === false && this !== MediaPreview) return;
			this.controls.update()
			this[Settings.get('ambient_occlusion_enabled') ? 'composer' : 'renderer'].render(
				display_mode
					? display_scene
					: scene,
				this.camera
			)
		}

		Preview.prototype.resize = function(width, height) {

			if (this.canvas.isConnected && this !== MediaPreview) {
				this.height = this.node.parentElement.clientHeight;
				this.width  = this.node.parentElement.clientWidth;
			} else if (height && width) {
				this.height = height;
				this.width = width;
			} else {
				return this;
			}

			if (!this.saoPass && this !== MediaPreview) {
				setupPreviewSAO(this);
			}
	
			if (this.isOrtho === false) {
				this.camPers.aspect = this.width / this.height
				this.camPers.updateProjectionMatrix();
			} else {
				this.camOrtho.right = this.width / 80
				this.camOrtho.left = this.camOrtho.right*-1
				this.camOrtho.top = this.height / 80
				this.camOrtho.bottom = this.camOrtho.top*-1
				this.camOrtho.updateProjectionMatrix();
			}
			

			this.renderer.setSize(this.width, this.height);
	
			if (this.canvas.isConnected) {
				this.renderer.setPixelRatio(window.devicePixelRatio);
				this.updateBackground()
				if (Transformer) {
					Transformer.update()
				}
			}

			if (this._wasOrtho != this.isOrtho && this !== MediaPreview) {
				this.renderPass.camera = this.camera;
				this.saoPass.camera = this.camera;
				this._wasOrtho == this.isOrtho;
			}

			return this;
		}

	},
	onunload() {
		if (settings.ambient_occlusion_enabled) settings.ambient_occlusion_enabled.delete();
		if (settings.ambient_occlusion_intensity) settings.ambient_occlusion_intensity.delete();
	}
});

})()

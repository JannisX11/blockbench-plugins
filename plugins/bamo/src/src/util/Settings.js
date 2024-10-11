export const BAMO_SETTINGS_DEFAULT = {
    displayName: "",
    namespace: "bamo",
    version: "1.20.1",
    typeList: [],
    material: "Dirt",
    blastRes: 6,
    slip: 0.6,
    gravity: false,
    rotType: "default",
    sounds: "Grass",
    lum: 0,
    maxStack: 64,
    fireproof: true,
    creativeTab: "Building Blocks",
    transparency: "Solid",
    blockType: "Default",
    types: {
        custom: true,
        customType: "Default",
        block: false,
        stair: false,
        slab: false,
        wall: false,
    },
    variant: {
        default:{
            all: "",
        },
        stair: {
            top: "",
            bottom: "",
            side: "",
            particle: ""
        },
        slab: {
            top: "",
            bottom: "",
            side: "",
            particle: ""
        },
        wall: {
            wall: "",
            particle: ""
        }
    },
    particles: false,
    particleType: "Rain",
    particlePos: {
        x: 8,
        y: 8,
        z: 8
    },
    particleSpread:{
        x: 1,
        y: 1,
        z: 1
    },
    particleVel: {
        x: 0.1,
        y: 0.1,
        z: 0.1
    },
    bufferedHitbox: true,
    hitboxBuffer: 0.5,
    genScRecipe: true,
    genReversableScRecipe: true,
    animated: false
};

Object.freeze(BAMO_SETTINGS_DEFAULT);

let bamoSettings = {}
bamoSettings[""] =  Object.assign({}, BAMO_SETTINGS_DEFAULT);

export default bamoSettings


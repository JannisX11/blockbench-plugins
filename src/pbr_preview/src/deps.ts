// @ts-expect-error THREE UMD is OK
const three = THREE;
// @ts-expect-error Vue UMD is OK
const vue = Vue;
// const bb = Blockbench;

// @ts-expect-error JSZip is on window
const jszip = window.JSZip;

export { three, vue, jszip };

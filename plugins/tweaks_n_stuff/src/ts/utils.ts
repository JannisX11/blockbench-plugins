/**
 * Process an array function in chunks.
 * @param {Array} array
 * @param {Function} callback
 */
export function process<T>(array: Array<T>, callback: (chunk: T, index: number) => void): void {
  let index = 0;
  function processChunk() {
    callback(array[index], index);
    index++;
    if (index < array.length) {
      requestAnimationFrame(processChunk);
    }
  }
  processChunk();
}

/**
 * Imports this package.
 * @param {string} url
 * @returns {Deletable}
 */
export function addScript(url: string): Deletable {
  class DeletableScript implements Deletable {
    constructor(private node: Element) {}
    delete() {
      this.node.remove();
    }
  }
  const script = document.createElement("script");
  script.src = url;
  try {
    new Promise((resolve, reject) => {
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  } catch (error) {
    console.error(`Failed to load script ${url}:`, error);
  }
  return new DeletableScript(script);
}

/**
 * Wraps a function in a try-catch statement to log any errors.
 * @param {Function} callback
 */
export function wrapError(callback: () => void): void {
  try {
    callback();
  } catch (err) {
    console.error(err);
  }
}

/**
 * Get a plugin by ID.
 * @param {string} id
 * @returns {Plugin|undefined}
 */
export function getPlugin(id: string): global.Plugin | undefined {
  return Plugins.all.find((p) => p.id == id);
}

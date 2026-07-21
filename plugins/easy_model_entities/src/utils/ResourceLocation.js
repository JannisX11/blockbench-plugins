/*
 * Copyright 2026 Markus Bordihn
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
 * NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

class ResourceLocation {
  static #NAMESPACE_PATTERN = /^[a-z0-9_.-]+$/;
  static #PATH_PATTERN = /^[a-z0-9_./-]+$/;

  static isValidNamespace(namespace) {
    return typeof namespace === 'string'
        && ResourceLocation.#NAMESPACE_PATTERN.test(namespace);
  }

  static isValidPath(path) {
    return typeof path === 'string' && ResourceLocation.#PATH_PATTERN.test(path)
        && !path.includes('..');
  }

  static isValidResourceLocation(value) {
    if (typeof value !== 'string' || !value.includes(':')) {
      return false;
    }
    const parts = value.split(':');
    if (parts.length !== 2) {
      return false;
    }
    return ResourceLocation.isValidNamespace(parts[0])
        && ResourceLocation.isValidPath(parts[1]);
  }

  static parseResourceLocation(value) {
    if (!ResourceLocation.isValidResourceLocation(value)) {
      return null;
    }
    const parts = value.split(':');
    return {namespace: parts[0], path: parts[1]};
  }

  static buildResourceLocation(namespace, path) {
    return `${namespace}:${path}`;
  }

  static sanitizeProfileId(name) {
    const base = String(name || '')
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_./-]+/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^[_./-]+|[_./-]+$/g, '');
    return base.length > 0 ? base : 'entity';
  }
}

module.exports = {ResourceLocation};

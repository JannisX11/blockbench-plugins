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

const {hashString} = require('./hash');

class ResourceLocation {
  static #NAMESPACE_PATTERN = /^[a-z0-9_.-]+$/;
  static #PATH_PATTERN = /^[a-z0-9_./-]+$/;
  static #MODEL_EXTENSION_PATTERN = /\.(bbmodel|json|gltf|glb|obj|geo)$/i;
  static #COMBINING_MARK_PATTERN = /[\u0300-\u036f]/g;
  static #TRANSLITERATIONS = new Map(Object.entries({
    'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss', 'å': 'aa', 'æ': 'ae',
    'ø': 'oe', 'œ': 'oe', 'þ': 'th', 'ð': 'dh', 'đ': 'd', 'ł': 'l',
    'ı': 'i', 'ĳ': 'ij', 'ŋ': 'ng', '&': '_and_', '+': '_plus_'
  }));

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

  static transliterate(value) {
    let transliterated = '';
    for (const character of String(value ?? '').toLowerCase()) {
      const replacement = ResourceLocation.#TRANSLITERATIONS.get(character);
      transliterated += replacement ?? character;
    }

    return transliterated.normalize('NFKD')
    .replace(ResourceLocation.#COMBINING_MARK_PATTERN, '');
  }

  static sanitizeProfileId(name) {
    const rawName = String(name ?? '').trim();
    const base = ResourceLocation.transliterate(
        rawName.replace(ResourceLocation.#MODEL_EXTENSION_PATTERN, ''))
    .replace(/[^a-z0-9_./-]+/g, '_')
    .replace(/_{2,}/g, '_')
    .split('/')
    .filter((segment) => segment !== '' && segment !== '.' && segment !== '..')
    .join('/')
    .replace(/^[_./-]+|[_./-]+$/g, '');
    if (base.length > 0) {
      return base;
    }

    return rawName.length > 0 ? `model_${hashString(rawName)}` : 'entity';
  }

  static sanitizeNamespace(namespace) {
    const base = ResourceLocation.transliterate(namespace)
    .replace(/[^a-z0-9_.-]+/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^[_.-]+|[_.-]+$/g, '');
    return base.length > 0 ? base : 'example_org';
  }
}

module.exports = {ResourceLocation};

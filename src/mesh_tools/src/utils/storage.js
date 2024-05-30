const KEYS_KEY = "<keys>";
const SUBS_KEY = "<subs>";
class BasicQualifiedStorage {
  constructor(id) {
    this.id = id;
  }
  #isQualified() {
    return this.id.startsWith("@");
  }
  qualifyKey(key) {
    if (this.#isQualified()) {
      return `${this.id}/${key}`;
    }
    return `@${this.id}/${key}`;
  }
  set(key, value) {
    key = this.qualifyKey(key);

    localStorage.setItem(key, JSON.stringify(value));
  }
  delete(key) {
    key = this.qualifyKey(key);

    localStorage.removeItem(key);
  }
  has(key) {
    key = this.qualifyKey(key);

    return localStorage.hasOwnProperty(key);
  }
  get(key) {
    key = this.qualifyKey(key);

    const rawValue = localStorage.getItem(key);
    if (rawValue != null) {
      return JSON.parse(rawValue);
    }
    return null;
  }
  update(key, callback, defaultValue) {
    const value = this.get(key) ?? defaultValue;
    const newValue = callback(value);
    return this.set(key, newValue);
  }
}

const keysStorage = new BasicQualifiedStorage(KEYS_KEY);
const subStoragesStorage = new BasicQualifiedStorage(SUBS_KEY);
export class QualifiedStorage extends BasicQualifiedStorage {
  
  in(key) {
    subStoragesStorage.update(this.id, (keys) => {
      keys.safePush(key);
      return keys;
    }, []);
    return new QualifiedStorage(this.qualifyKey(key));
  }

  constructor(id) {
    console.assert(
      id != KEYS_KEY,
      `QualifiedStorage: id cannot be equal to ${JSON.stringify(KEYS_KEY)}`
    );

    super(id);
  }
  set(key, value) {
    keysStorage.update(
      this.id,
      (keys) => {
        keys.safePush(key);
        return keys;
      },
      []
    );

    super.set(key, value);
  }
  delete(key) {
    keysStorage.update(
      this.id,
      (keys) => {
        const index = keys.indexOf(key);
        if (index != -1) {
          keys.splice(index, 1);
        }

        return keys;
      },
      []
    );

    super.delete(key);
  }
  getAllKeys() {
    return keysStorage.get(this.id) ?? [];
  }
  clear() {
    for (const key of this.getAllKeys()) {
      super.delete(key);
    }
    const subKeys = subStoragesStorage.get(this.id) ?? [];
    for (const subKey of subKeys) {
      new QualifiedStorage(this.qualifyKey(subKey)).clear();
    }
    keysStorage.delete(this.id);
    subStoragesStorage.delete(this.id);
  }
}

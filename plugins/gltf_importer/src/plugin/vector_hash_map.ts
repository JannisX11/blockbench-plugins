// Hash map that hashes lists of numbers by their components instead of their object reference
// Used for de-duplicating vertices
export class VectorHashMap<TKey extends number[], TValue> {

    backingMap: {[hash: number]: [TKey, TValue][]};

    constructor() {
        this.backingMap = {};
    }

    has(key: TKey): boolean {
        return this.getKeyValuePair(key) != undefined;
    }

    get(key: TKey): TValue|undefined {
        return this.getKeyValuePair(key)?.[1];
    }

    set(key: TKey, value: TValue) {
        let bucket = this.getBucket(key);

        if (bucket == undefined) {
            this.backingMap[this.getHashCode(key)] = [ [key, value] ];
            return;
        }

        let keyValuePair = this.getKeyValuePair(key);

        if (keyValuePair == undefined) {
            bucket.push([key, value]);
            return;
        }

        keyValuePair[1] = value;
    }

    remove(key: TKey) {
        this.getBucket(key)?.remove(this.getKeyValuePair(key));
    }

    getHashCode(key: TKey): number {
        // FNV-1a hash
        let hash = 2166136261; // 32-bit FNV offset basis
        for (let component of key) {
            // Break number into 4 bytes to ensure uniqueness
            let component32 = component | 0; // force to 32-bit int
            for (let i = 0; i < 4; i++) {
                let byte = (component32 >>> (i * 8)) & 0xff;
                hash ^= byte;
                hash = Math.imul(hash, 16777619); // FNV prime
            }
        }

        return hash >>> 0; // Return as unsigned 32-bit int
    }

    getBucket(key: TKey): [TKey, TValue][]|undefined {
        return this.backingMap[this.getHashCode(key)];
    }

    getKeyValuePair(key: TKey): [TKey, TValue]|undefined {
        return this.getBucket(key)?.find(([k,v]) => k.every((c,i) => c === key[i]));
    }

}

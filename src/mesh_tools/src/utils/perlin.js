export const perlin = {
  reusableVec3: new THREE.Vector3(),
  perlinVectorSeed: new THREE.Vector3(12.9898, 78.233, 190.124),

  randomAt(x, y, z) {
    const vec = this.reusableVec3.set(x, y, z);
    return (Math.sin(this.perlinVectorSeed.dot(vec)) * 43758.5453) % 1;
  },
  interpolate(a0, a1, w) {
    if (0 >= w) return a0;
    if (1 <= w) return a1;
    return (a1 - a0) * (3 - w * 2) * w * w + a0;
  },
  grad(ix, iy, iz) {
    const rand = this.randomAt(ix, iy, iz) * Math.PI * 2;

    const sin = Math.sin(rand);
    const cos = Math.cos(rand);

    const x = sin * cos;
    const y = cos * cos;
    const z = sin;

    return { x, y, z };
  },
  dotgrad(ix, iy, iz, x, y, z) {
    const gradient = this.grad(ix, iy, iz);

    const dx = x - ix;
    const dy = y - iy;
    const dz = z - iz;

    return dx * gradient.x + dy * gradient.y + dz * gradient.z;
  },
  get(x = 0, y = 0, z = 0) {
    x = (x + 128) % 128;
    y = (y + 128) % 128;
    z = (z + 128) % 128;

    const x0 = Math.floor(x);
    const x1 = x0 + 1;
    const y0 = Math.floor(y);
    const y1 = y0 + 1;
    const z0 = Math.floor(z);
    const z1 = z0 + 1;

    const sx = x % 1;
    const sy = y % 1;
    const sz = z % 1;

    let n0, n1, n2, n3;

    // North Side of the Cube
    n0 = this.dotgrad(x0, y0, z0, x, y, z);
    n1 = this.dotgrad(x1, y0, z0, x, y, z);
    const i0 = this.interpolate(n0, n1, sx);

    n0 = this.dotgrad(x0, y1, z0, x, y, z);
    n1 = this.dotgrad(x1, y1, z0, x, y, z);
    const i1 = this.interpolate(n0, n1, sx);
    const valuen = this.interpolate(i0, i1, sy);

    // West Side of the Cube
    n2 = this.dotgrad(x0, y0, z1, x, y, z);
    n3 = this.dotgrad(x1, y0, z1, x, y, z);
    const i2 = this.interpolate(n2, n3, sx);

    n2 = this.dotgrad(x0, y1, z1, x, y, z);
    n3 = this.dotgrad(x1, y1, z1, x, y, z);
    const i3 = this.interpolate(n2, n3, sx);
    const valuew = this.interpolate(i2, i3, sy);

    const value = this.interpolate(valuen, valuew, sz);
    return value;
  },
};

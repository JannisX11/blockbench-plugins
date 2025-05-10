const _v3 = /*@__PURE__*/ new THREE.Vector3();

Object.assign(THREE.Triangle, {
  getInterpolation(point, p1, p2, p3, v1, v2, v3, target) {
    if (THREE.Triangle.getBarycoord(point, p1, p2, p3, _v3) === null) {
      target.x = 0;
      target.y = 0;
      if ("z" in target) target.z = 0;
      if ("w" in target) target.w = 0;
      return null;
    }

    target.setScalar(0);
    target.addScaledVector(v1, _v3.x);
    target.addScaledVector(v2, _v3.y);
    target.addScaledVector(v3, _v3.z);

    return target;
  },
});

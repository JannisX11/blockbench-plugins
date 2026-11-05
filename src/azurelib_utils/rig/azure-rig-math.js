/**
 * AzureLib Animator — Rig Math
 * -----------------------------
 * Ports of AzureLib's runtime weight math (AzBlendWeights), so blend-space
 * previews in Blockbench mix animations with exactly the weights the game will.
 *
 * © 2026 AzureDoom — MIT License
 */

/**
 * 1D weights: the input is clamped to the samples' range and split linearly
 * between the two samples around it. Positions must be ascending.
 */
export function linearWeights(positions, input) {
  const n = positions.length;
  const dest = new Array(n).fill(0);

  if (n === 0) return dest;

  if (n === 1 || input <= positions[0]) {
    dest[0] = 1;
    return dest;
  }

  if (input >= positions[n - 1]) {
    dest[n - 1] = 1;
    return dest;
  }

  for (let i = 0; i < n - 1; i++) {
    const from = positions[i];
    const to = positions[i + 1];

    if (input <= to) {
      const span = to - from;
      const t = span <= 0 ? 1 : (input - from) / span;
      dest[i] = 1 - t;
      dest[i + 1] = t;
      return dest;
    }
  }

  dest[n - 1] = 1;
  return dest;
}

/**
 * 2D weights by gradient band interpolation (freeform cartesian), as
 * AzBlendWeights.gradientBand: the input on a sample plays that sample alone.
 */
export function gradientBandWeights(xs, ys, x, y) {
  const n = xs.length;
  const dest = new Array(n).fill(0);

  if (n === 0) return dest;

  let total = 0;

  for (let i = 0; i < n; i++) {
    let weight = 1;
    const px = x - xs[i];
    const py = y - ys[i];

    for (let j = 0; j < n && weight > 0; j++) {
      if (i === j) continue;

      const ex = xs[j] - xs[i];
      const ey = ys[j] - ys[i];
      const lengthSq = ex * ex + ey * ey;

      if (lengthSq <= 0) continue;

      const h = 1 - (px * ex + py * ey) / lengthSq;
      weight = Math.min(weight, Math.max(0, Math.min(1, h)));
    }

    dest[i] = weight;
    total += weight;
  }

  if (total > 0) {
    for (let i = 0; i < n; i++) dest[i] /= total;
    return dest;
  }

  let nearest = 0;
  let best = Infinity;

  for (let i = 0; i < n; i++) {
    const dx = x - xs[i];
    const dy = y - ys[i];
    const d = dx * dx + dy * dy;
    dest[i] = 0;

    if (d < best) {
      best = d;
      nearest = i;
    }
  }

  dest[nearest] = 1;
  return dest;
}

/**
 * Sample weights for a blend space definition at the given input, with the
 * samples in the same order as {@code blendSpace.samples}.
 */
export function blendSpaceWeights(blendSpace, inputX, inputY = 0) {
  const samples = blendSpace.samples || [];

  if (blendSpace.dimensions === 2) {
    return gradientBandWeights(samples.map(s => s.x), samples.map(s => s.y), inputX, inputY);
  }

  // 1D: AzureLib sorts samples by position; weight in sorted order, then map back.
  const order = samples.map((s, i) => i).sort((a, b) => samples[a].x - samples[b].x);
  const sorted = linearWeights(order.map(i => samples[i].x), inputX);
  const weights = new Array(samples.length).fill(0);
  order.forEach((sampleIndex, sortedIndex) => { weights[sampleIndex] = sorted[sortedIndex]; });
  return weights;
}

/** The input range a blend space covers, for preview sliders. */
export function blendSpaceRange(blendSpace) {
  const samples = blendSpace.samples || [];
  const range = (values) => {
    if (!values.length) return [0, 1];
    let min = Math.min(...values);
    let max = Math.max(...values);
    if (min === max) { min -= 1; max += 1; }
    return [min, max];
  };
  return { x: range(samples.map(s => s.x)), y: range(samples.map(s => s.y)) };
}

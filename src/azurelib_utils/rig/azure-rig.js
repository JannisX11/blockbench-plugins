/**
 * AzureLib Animator — Rig Features
 * --------------------------------
 * Entry point for AzureLib's runtime rig features in Blockbench: hitboxes,
 * sockets, runtime IK, look-at, constraints, spring bones and blend spaces.
 *
 * © 2026 AzureDoom — MIT License
 */

import { registerRigState, unregisterRigState } from './azure-rig-state.js';
import { registerRigPreview, unregisterRigPreview } from './azure-rig-preview.js';
import { registerRigPanel, unregisterRigPanel } from './azure-rig-panel.js';

let registered = false;

export function registerRig() {
  if (registered) return;
  registered = true;
  registerRigState();
  registerRigPreview();
  registerRigPanel();
}

export function unregisterRig() {
  if (!registered) return;
  registered = false;
  unregisterRigPanel();
  unregisterRigPreview();
  unregisterRigState();
}

/**
 * Myrlin's Tools v2.0 - Blockbench Plugin
 *
 * Optimization, validation, and template tools for Hytale models.
 * https://forge.myrlin.io
 *
 * Features:
 * - Box Optimizer: Merge adjacent boxes to reduce count (spatial-hash O(n))
 * - Hollow Interior: Remove hidden internal boxes (switched off in 3.4.2, coming back in 3.5.0)
 * - Art Style Validator: 5-check validation against Hytale requirements
 * - Template Wizard: Create correctly structured starter models
 * - Config Generator: Export model + JSON configs as mod .zip
 * - Palette Converter: Remap texture colors to Hytale palettes
 * - Per-Bone Node Budget: Visualize node distribution across bones
 * - Model Browser: Browse and import from Myrlin gallery
 * - Import Validation: Validate models against asset spec entries
 * - Mod Project: Create/manage mod projects with asset tracking
 * - Dual-Market Export: Export to Hytale and Minecraft simultaneously
 */

import { setupPanel } from './ui/panel';
import { setupActions } from './actions';
import { setupStatusBar } from './ui/status';
import { setupBrowser } from './ui/browser';
import { setupTemplateWizard } from './features/template_wizard';
import { setupValidator } from './features/validator';
import { setupConfigGenerator } from './features/config_generator';
import { setupRepairPanel } from './features/repair_panel';
import { setupExportDialog } from './features/export_dialog';
import { setupValidationPanel } from './features/validation_panel';
import { setupImportValidation } from './features/import_validation';
import { setupModProject } from './features/mod_project';
import { setupDualExport } from './features/dual_export';
import { setupPowerTools } from './features/power_tools';
import { cleanup, track } from './utils/cleanup';

const PLUGIN_ID = 'myrlins_tools';
const VERSION = '3.4.3';

// @ts-ignore - BBPlugin is a global from Blockbench
BBPlugin.register(PLUGIN_ID, {
    title: "Myrlin's Tools",
    author: 'Myrlin (forge.myrlin.io)',
    icon: 'auto_fix_high',
    version: VERSION,
    description: 'Hytale modding toolkit - Box optimizer, art style validator, template wizard, config generator, and more.',
    tags: ['Hytale', 'Optimization', 'Validation'],
    variant: 'both',
    min_version: '4.8.0',

    onload() {
        console.log(`[Myrlin's Tools] Loading v${VERSION}...`);

        // Core UI
        setupPanel();
        setupActions();
        setupStatusBar();
        // 3.4.3: the Model Browser reads Myrlin's online gallery, so the store edition leaves it out (src/edition.d.ts).
        if (!(typeof MYRLIN_STORE_EDITION !== 'undefined' && MYRLIN_STORE_EDITION === true)) {
            setupBrowser();
        }

        // New v2.0 features
        setupTemplateWizard();
        setupValidator();
        setupConfigGenerator();
        // 3.4.3: Auto Repair has nothing it can repair yet (api-client repair()), so the store edition leaves it out.
        if (!(typeof MYRLIN_STORE_EDITION !== 'undefined' && MYRLIN_STORE_EDITION === true)) {
            setupRepairPanel();
        }
        // 3.4.3: export to other formats converts on Myrlin's API, so the store edition leaves it out.
        if (!(typeof MYRLIN_STORE_EDITION !== 'undefined' && MYRLIN_STORE_EDITION === true)) {
            setupExportDialog();
        }
        setupValidationPanel();

        // v3.1.0 features
        setupImportValidation();
        setupModProject();
        // 3.4.3: Dual Export also converts on the API; not in the store edition.
        if (!(typeof MYRLIN_STORE_EDITION !== 'undefined' && MYRLIN_STORE_EDITION === true)) {
            setupDualExport();
        }

        // v3.2.0 features
        setupPowerTools();

        console.log(`[Myrlin's Tools] Loaded successfully! (v${VERSION})`);
    },

    onunload() {
        console.log(`[Myrlin's Tools] Unloading...`);
        cleanup();
    }
});

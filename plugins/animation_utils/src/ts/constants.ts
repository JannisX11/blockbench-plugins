/**
 * GeckoLib plugin model format ID. Used to identify model types generated from this plugin
 */
export const GECKOLIB_MODEL_ID = "animated_entity_model"

// Setting name constants
export const SETTING_AUTO_PARTICLE_TEXTURE = 'geckolib_auto_particle_texture';
export const SETTING_CONVERT_BEDROCK_ANIMATIONS = 'geckolib_convert_bedrock_animations';
export const SETTING_ALWAYS_SHOW_DISPLAY = 'geckolib_always_show_display';
export const SETTING_REMEMBER_EXPORT_LOCATIONS = 'geckolib_remember_export_locations';
export const SETTING_DEFAULT_MODID = 'geckolib_default_modid';

// Property name constants
export const PROPERTY_MODID = 'geckolib_modid';
export const PROPERTY_MODEL_TYPE = 'geckolib_model_type';
export const PROPERTY_FILEPATH_CACHE = 'geckolib_filepath_cache';

/**
 * Available GeckoLib model types
 */
export enum GeckoModelType {
    ENTITY = 'Entity',
    BLOCK = 'Block',
    ITEM = 'Item',
    ARMOR = 'Armor',
    OBJECT = 'Object'
}

/**
 * Statically defined type for the filepath cache property, for ease of use
 */
export type GeckoFilepathCache = {model?: string, animation?: string, display?: string}
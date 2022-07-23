/*
	Tint Preview - A Blockbench plugin to preview tint effect on JSON models
	Copyright (C) 2022  MrCrayfish

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
var defaultTintColor = [1.0, 0.705, 0.294];
var dragTintColor = null;
var origMats = [];

var blockColorOptions = {
	'empty': 'Select...',
	'foilage_badlands': 'Foilage (Badlands)',
	'foilage_bamboo_jungle': 'Foilage (Bamboo Jungle)',
	'foilage_basalt_deltas': 'Foilage (Basalt Deltas)',
	'foilage_beach': 'Foilage (Beach)',
	'foilage_birch_forest': 'Foilage (Birch Forest)',
	'foilage_cold_ocean': 'Foilage (Cold Ocean)',
	'foilage_crimson_forest': 'Foilage (Crimson Forest)',
	'foilage_dark_forest': 'Foilage (Dark Forest)',
	'foilage_deep_cold_ocean': 'Foilage (Deep Cold Ocean)',
	'foilage_deep_frozen_ocean': 'Foilage (Deep Frozen Ocean)',
	'foilage_deep_lukewarm_ocean': 'Foilage (Deep Lukewarm Ocean)',
	'foilage_deep_ocean': 'Foilage (Deep Ocean)',
	'foilage_desert': 'Foilage (Desert)',
	'foilage_dripstone_caves': 'Foilage (Dripstone Caves)',
	'foilage_end_barrens': 'Foilage (End Barrens)',
	'foilage_end_highlands': 'Foilage (End Highlands)',
	'foilage_end_midlands': 'Foilage (End Midlands)',
	'foilage_eroded_badlands': 'Foilage (Eroded Badlands)',
	'foilage_flower_forest': 'Foilage (Flower Forest)',
	'foilage_forest': 'Foilage (Forest)',
	'foilage_frozen_ocean': 'Foilage (Frozen Ocean)',
	'foilage_frozen_peaks': 'Foilage (Frozen Peaks)',
	'foilage_frozen_river': 'Foilage (Frozen River)',
	'foilage_grove': 'Foilage (Grove)',
	'foilage_ice_spikes': 'Foilage (Ice Spikes)',
	'foilage_jagged_peaks': 'Foilage (Jagged Peaks)',
	'foilage_jungle': 'Foilage (Jungle)',
	'foilage_lukewarm_ocean': 'Foilage (Lukewarm Ocean)',
	'foilage_lush_caves': 'Foilage (Lush Caves)',
	'foilage_meadow': 'Foilage (Meadow)',
	'foilage_mushroom_fields': 'Foilage (Mushroom Fields)',
	'foilage_nether_wastes': 'Foilage (Nether Wastes)',
	'foilage_ocean': 'Foilage (Ocean)',
	'foilage_old_growth_birch_forest': 'Foilage (Old Growth Birch Forest)',
	'foilage_old_growth_pine_taiga': 'Foilage (Old Growth Pine Taiga)',
	'foilage_old_growth_spruce_taiga': 'Foilage (Old Growth Spruce Taiga)',
	'foilage_plains': 'Foilage (Plains)',
	'foilage_river': 'Foilage (River)',
	'foilage_savanna': 'Foilage (Savanna)',
	'foilage_savanna_plateau': 'Foilage (Savanna Plateau)',
	'foilage_small_end_islands': 'Foilage (Small End Islands)',
	'foilage_snowy_beach': 'Foilage (Snowy Beach)',
	'foilage_snowy_plains': 'Foilage (Snowy Plains)',
	'foilage_snowy_slopes': 'Foilage (Snowy Slopes)',
	'foilage_snowy_taiga': 'Foilage (Snowy Taiga)',
	'foilage_soul_sand_valley': 'Foilage (Soul Sand Valley)',
	'foilage_sparse_jungle': 'Foilage (Sparse Jungle)',
	'foilage_stony_peaks': 'Foilage (Stony Peaks)',
	'foilage_stony_shore': 'Foilage (Stony Shore)',
	'foilage_sunflower_plains': 'Foilage (Sunflower Plains)',
	'foilage_swamp': 'Foilage (Swamp)',
	'foilage_taiga': 'Foilage (Taiga)',
	'foilage_the_end': 'Foilage (The End)',
	'foilage_the_void': 'Foilage (The Void)',
	'foilage_warm_ocean': 'Foilage (Warm Ocean)',
	'foilage_warped_forest': 'Foilage (Warped Forest)',
	'foilage_windswept_forest': 'Foilage (Windswept Forest)',
	'foilage_windswept_gravelly_hills': 'Foilage (Windswept Gravelly Hills)',
	'foilage_windswept_hills': 'Foilage (Windswept Hills)',
	'foilage_windswept_savanna': 'Foilage (Windswept Savanna)',
	'foilage_wooded_badlands': 'Foilage (Wooded Badlands)',
	'grass_badlands': 'Grass (Badlands)',
	'grass_bamboo_jungle': 'Grass (Bamboo Jungle)',
	'grass_basalt_deltas': 'Grass (Basalt Deltas)',
	'grass_beach': 'Grass (Beach)',
	'grass_birch_forest': 'Grass (Birch Forest)',
	'grass_cold_ocean': 'Grass (Cold Ocean)',
	'grass_crimson_forest': 'Grass (Crimson Forest)',
	'grass_dark_forest': 'Grass (Dark Forest)',
	'grass_deep_cold_ocean': 'Grass (Deep Cold Ocean)',
	'grass_deep_frozen_ocean': 'Grass (Deep Frozen Ocean)',
	'grass_deep_lukewarm_ocean': 'Grass (Deep Lukewarm Ocean)',
	'grass_deep_ocean': 'Grass (Deep Ocean)',
	'grass_desert': 'Grass (Desert)',
	'grass_dripstone_caves': 'Grass (Dripstone Caves)',
	'grass_end_barrens': 'Grass (End Barrens)',
	'grass_end_highlands': 'Grass (End Highlands)',
	'grass_end_midlands': 'Grass (End Midlands)',
	'grass_eroded_badlands': 'Grass (Eroded Badlands)',
	'grass_flower_forest': 'Grass (Flower Forest)',
	'grass_forest': 'Grass (Forest)',
	'grass_frozen_ocean': 'Grass (Frozen Ocean)',
	'grass_frozen_peaks': 'Grass (Frozen Peaks)',
	'grass_frozen_river': 'Grass (Frozen River)',
	'grass_grove': 'Grass (Grove)',
	'grass_ice_spikes': 'Grass (Ice Spikes)',
	'grass_jagged_peaks': 'Grass (Jagged Peaks)',
	'grass_jungle': 'Grass (Jungle)',
	'grass_lukewarm_ocean': 'Grass (Lukewarm Ocean)',
	'grass_lush_caves': 'Grass (Lush Caves)',
	'grass_meadow': 'Grass (Meadow)',
	'grass_mushroom_fields': 'Grass (Mushroom Fields)',
	'grass_nether_wastes': 'Grass (Nether Wastes)',
	'grass_ocean': 'Grass (Ocean)',
	'grass_old_growth_birch_forest': 'Grass (Old Growth Birch Forest)',
	'grass_old_growth_pine_taiga': 'Grass (Old Growth Pine Taiga)',
	'grass_old_growth_spruce_taiga': 'Grass (Old Growth Spruce Taiga)',
	'grass_plains': 'Grass (Plains)',
	'grass_river': 'Grass (River)',
	'grass_savanna': 'Grass (Savanna)',
	'grass_savanna_plateau': 'Grass (Savanna Plateau)',
	'grass_small_end_islands': 'Grass (Small End Islands)',
	'grass_snowy_beach': 'Grass (Snowy Beach)',
	'grass_snowy_plains': 'Grass (Snowy Plains)',
	'grass_snowy_slopes': 'Grass (Snowy Slopes)',
	'grass_snowy_taiga': 'Grass (Snowy Taiga)',
	'grass_soul_sand_valley': 'Grass (Soul Sand Valley)',
	'grass_sparse_jungle': 'Grass (Sparse Jungle)',
	'grass_stony_peaks': 'Grass (Stony Peaks)',
	'grass_stony_shore': 'Grass (Stony Shore)',
	'grass_sunflower_plains': 'Grass (Sunflower Plains)',
	'grass_swamp': 'Grass (Swamp)',
	'grass_swamp': 'Grass (Swamp)',
	'grass_taiga': 'Grass (Taiga)',
	'grass_the_end': 'Grass (The End)',
	'grass_the_void': 'Grass (The Void)',
	'grass_warm_ocean': 'Grass (Warm Ocean)',
	'grass_warped_forest': 'Grass (Warped Forest)',
	'grass_windswept_forest': 'Grass (Windswept Forest)',
	'grass_windswept_gravelly_hills': 'Grass (Windswept Gravelly Hills)',
	'grass_windswept_hills': 'Grass (Windswept Hills)',
	'grass_windswept_savanna': 'Grass (Windswept Savanna)',
	'grass_wooded_badlands': 'Grass (Wooded Badlands)',
	'leaves_birch': 'Leaves (Birch)',
	'leaves_spruce': 'Leaves (Spruce)',
	'lily_pad': 'Lily Pad',
	'redstone_0': 'Redstone (Power 0)',
	'redstone_1': 'Redstone (Power 1)',
	'redstone_2': 'Redstone (Power 2)',
	'redstone_3': 'Redstone (Power 3)',
	'redstone_4': 'Redstone (Power 4)',
	'redstone_5': 'Redstone (Power 5)',
	'redstone_6': 'Redstone (Power 6)',
	'redstone_7': 'Redstone (Power 7)',
	'redstone_8': 'Redstone (Power 8)',
	'redstone_9': 'Redstone (Power 9)',
	'redstone_10': 'Redstone (Power 10)',
	'redstone_11': 'Redstone (Power 11)',
	'redstone_12': 'Redstone (Power 12)',
	'redstone_13': 'Redstone (Power 13)',
	'redstone_14': 'Redstone (Power 14)',
	'redstone_15': 'Redstone (Power 15)',
	'water_badlands': 'Water (Badlands)',
	'water_bamboo_jungle': 'Water (Bamboo Jungle)',
	'water_basalt_deltas': 'Water (Basalt Deltas)',
	'water_beach': 'Water (Beach)',
	'water_birch_forest': 'Water (Birch Forest)',
	'water_cold_ocean': 'Water (Cold Ocean)',
	'water_crimson_forest': 'Water (Crimson Forest)',
	'water_dark_forest': 'Water (Dark Forest)',
	'water_deep_cold_ocean': 'Water (Deep Cold Ocean)',
	'water_deep_dark': 'Water (Deep Dark)',
	'water_deep_frozen_ocean': 'Water (Deep Frozen Ocean)',
	'water_deep_lukewarm_ocean': 'Water (Deep Lukewarm Ocean)',
	'water_deep_ocean': 'Water (Deep Ocean)',
	'water_desert': 'Water (Desert)',
	'water_dripstone_caves': 'Water (Dripstone Caves)',
	'water_end_barrens': 'Water (End Barrens)',
	'water_end_midlands': 'Water (End Midlands)',
	'water_eroded_badlands': 'Water (Eroded Badlands)',
	'water_flower_forest': 'Water (Flower Forest)',
	'water_forest': 'Water (Forest)',
	'water_frozen_ocean': 'Water (Frozen Ocean)',
	'water_frozen_peaks': 'Water (Frozen Peaks)',
	'water_frozen_river': 'Water (Frozen River)',
	'water_grove': 'Water (Grove)',
	'water_ice_spikes': 'Water (Ice Spikes)',
	'water_jagged_peaks': 'Water (Jagged Peaks)',
	'water_jungle': 'Water (Jungle)',
	'water_lukewarm_ocean': 'Water (Lukewarm Ocean)',
	'water_lush_caves': 'Water (Lush Caves)',
	'water_meadow': 'Water (Meadow)',
	'water_mushroom_fields': 'Water (Mushroom Fields)',
	'water_nether_wastes': 'Water (Nether Wastes)',
	'water_ocean': 'Water (Ocean)',
	'water_old_growth_birch_forest': 'Water (Old Growth Birch Forest)',
	'water_old_growth_pine_taiga': 'Water (Old Growth Pine Taiga)',
	'water_old_growth_spruce_taiga': 'Water (Old Growth Spruce Taiga)',
	'water_plains': 'Water (Plains)',
	'water_river': 'Water (River)',
	'water_savanna': 'Water (Savanna)',
	'water_savanna_plateau': 'Water (Savanna Plateau)',
	'water_small_end_islands': 'Water (Small End Islands)',
	'water_snowy_beach': 'Water (Snowy Beach)',
	'water_snowy_plains': 'Water (Snowy Plains)',
	'water_snowy_slopes': 'Water (Snowy Slopes)',
	'water_snowy_taiga': 'Water (Snowy Taiga)',
	'water_soul_sand_valley': 'Water (Soul Sand Valley)',
	'water_sparse_jungle': 'Water (Sparse Jungle)',
	'water_stony_peaks': 'Water (Stony Peaks)',
	'water_stony_shore': 'Water (Stony Shore)',
	'water_sunflower_plains': 'Water (Sunflower Plains)',
	'water_swamp': 'Water (Swamp)',
	'water_taiga': 'Water (Taiga)',
	'water_the_end': 'Water (The End)',
	'water_the_void': 'Water (The Void)',
	'water_warm_ocean': 'Water (Warm Ocean)',
	'water_warped_forest': 'Water (Warped Forest)',
	'water_windswept_forest': 'Water (Windswept Forest)',
	'water_windswept_gravelly_hills': 'Water (Windswept Gravelly Hills)',
	'water_windswept_hills': 'Water (Windswept Hills)',
	'water_windswept_savanna': 'Water (Windswept Savanna)',
	'water_wooded_badlands': 'Water (Wooded Badlands)'
}

// Color values sourced from https://minecraft.fandom.com/wiki/Block_colors
var blockColorValues = {
	'foilage_badlands': '#9e814d',
	'foilage_bamboo_jungle': '#30bb0b',
	'foilage_basalt_deltas': '#aea42a',
	'foilage_beach': '#77ab2f',
	'foilage_birch_forest': '#6ba941',
	'foilage_cold_ocean': '#71a74d',
	'foilage_crimson_forest': '#aea42a',
	'foilage_dark_forest': '#59ae30',
	'foilage_deep_cold_ocean': '#71a74d',
	'foilage_deep_frozen_ocean': '#71a74d',
	'foilage_deep_lukewarm_ocean': '#71a74d',
	'foilage_deep_ocean': '#71a74d',
	'foilage_desert': '#aea42a',
	'foilage_dripstone_caves': '#77ab2f',
	'foilage_end_barrens': '#71a74d',
	'foilage_end_highlands': '#71a74d',
	'foilage_end_midlands': '#71a74d',
	'foilage_eroded_badlands': '#9e814d',
	'foilage_flower_forest': '#59ae30',
	'foilage_forest': '#59ae30',
	'foilage_frozen_ocean': '#60a17b',
	'foilage_frozen_peaks': '#60a17b',
	'foilage_frozen_river': '#60a17b',
	'foilage_grove': '#60a17b',
	'foilage_ice_spikes': '#60a17b',
	'foilage_jagged_peaks': '#60a17b',
	'foilage_jungle': '#30bb0b',
	'foilage_lukewarm_ocean': '#71a74d',
	'foilage_lush_caves': '#71a74d',
	'foilage_meadow': '#63a948',
	'foilage_mushroom_fields': '#2bbb0f',
	'foilage_nether_wastes': '#aea42a',
	'foilage_ocean': '#71a74d',
	'foilage_old_growth_birch_forest': '#6ba941',
	'foilage_old_growth_pine_taiga': '#68a55f',
	'foilage_old_growth_spruce_taiga': '#68a464',
	'foilage_plains': '#77ab2f',
	'foilage_river': '#71a74d',
	'foilage_savanna': '#aea42a',
	'foilage_savanna_plateau': '#aea42a',
	'foilage_small_end_islands': '#71a74d',
	'foilage_snowy_beach': '#64a278',
	'foilage_snowy_plains': '#60a17b',
	'foilage_snowy_slopes': '#60a17b',
	'foilage_snowy_taiga': '#60a17b',
	'foilage_soul_sand_valley': '#aea42a',
	'foilage_sparse_jungle': '#3eb80f',
	'foilage_stony_peaks': '#82ac1e',
	'foilage_stony_shore': '#6da36b',
	'foilage_sunflower_plains': '#77ab2f',
	'foilage_swamp': '#6a7039',
	'foilage_taiga': '#68a464',
	'foilage_the_end': '#71a74d',
	'foilage_the_void': '#71a74d',
	'foilage_warm_ocean': '#71a74d',
	'foilage_warped_forest': '#aea42a',
	'foilage_windswept_forest': '#6da36b',
	'foilage_windswept_gravelly_hills': '#6da36b',
	'foilage_windswept_hills': '#6da36b',
	'foilage_windswept_savanna': '#aea42a',
	'foilage_wooded_badlands': '#9e814d',
	'grass_badlands': '#90814d',
	'grass_bamboo_jungle': '#59c93c',
	'grass_basalt_deltas': '#bfb755',
	'grass_beach': '#91bd59',
	'grass_birch_forest': '#88bb67',
	'grass_cold_ocean': '#8eb971',
	'grass_crimson_forest': '#bfb755',
	'grass_dark_forest': '#507a32',
	'grass_deep_cold_ocean': '#8eb971',
	'grass_deep_frozen_ocean': '#8eb971',
	'grass_deep_lukewarm_ocean': '#8eb971',
	'grass_deep_ocean': '#8eb971',
	'grass_desert': '#bfb755',
	'grass_dripstone_caves': '#91bd59',
	'grass_end_barrens': '#8eb971',
	'grass_end_highlands': '#8eb971',
	'grass_end_midlands': '#8eb971',
	'grass_eroded_badlands': '#90814d',
	'grass_flower_forest': '#79c05a',
	'grass_forest': '#79c05a',
	'grass_frozen_ocean': '#80b497',
	'grass_frozen_peaks': '#80b497',
	'grass_frozen_river': '#80b497',
	'grass_grove': '#80b497',
	'grass_ice_spikes': '#80b497',
	'grass_jagged_peaks': '#80b497',
	'grass_jungle': '#59c93c',
	'grass_lukewarm_ocean': '#8eb971',
	'grass_lush_caves': '#8eb971',
	'grass_meadow': '#83bb6d',
	'grass_mushroom_fields': '#55c93f',
	'grass_nether_wastes': '#bfb755',
	'grass_ocean': '#8eb971',
	'grass_old_growth_birch_forest': '#88bb67',
	'grass_old_growth_pine_taiga': '#86b87f',
	'grass_old_growth_spruce_taiga': '#86b783',
	'grass_plains': '#91bd59',
	'grass_river': '#8eb971',
	'grass_savanna': '#bfb755',
	'grass_savanna_plateau': '#bfb755',
	'grass_small_end_islands': '#8eb971',
	'grass_snowy_beach': '#83b593',
	'grass_snowy_plains': '#80b497',
	'grass_snowy_slopes': '#80b497',
	'grass_snowy_taiga': '#80b497',
	'grass_soul_sand_valley': '#bfb755',
	'grass_sparse_jungle': '#64c73f',
	'grass_stony_peaks': '#9abe4b',
	'grass_stony_shore': '#8ab689',
	'grass_sunflower_plains': '#91bd59',
	'grass_swamp': '#4c763c',
	'grass_swamp': '#6a7039',
	'grass_taiga': '#86b783',
	'grass_the_end': '#8eb971',
	'grass_the_void': '#8eb971',
	'grass_warm_ocean': '#8eb971',
	'grass_warped_forest': '#bfb755',
	'grass_windswept_forest': '#8ab689',
	'grass_windswept_gravelly_hills': '#8ab689',
	'grass_windswept_hills': '#8ab689',
	'grass_windswept_savanna': '#bfb755',
	'grass_wooded_badlands': '#90814d',
	'leaves_birch': '#80a755',
	'leaves_spruce': '#619961',
	'lily_pad': '#208030',
	'redstone_0': '#4b0000',
	'redstone_1': '#6f0000',
	'redstone_2': '#790000',
	'redstone_3': '#820000',
	'redstone_4': '#8c0000',
	'redstone_5': '#970000',
	'redstone_6': '#a10000',
	'redstone_7': '#ab0000',
	'redstone_8': '#b50000',
	'redstone_9': '#bf0000',
	'redstone_10': '#ca0000',
	'redstone_11': '#d30000',
	'redstone_12': '#dd0000',
	'redstone_13': '#e70600',
	'redstone_14': '#f11b00',
	'redstone_15': '#fc3100',
	'water_badlands': '#3f76e4',
	'water_bamboo_jungle': '#3f76e4',
	'water_basalt_deltas': '#3f76e4',
	'water_beach': '#3f76e4',
	'water_birch_forest': '#3f76e4',
	'water_cold_ocean': '#3d57d6',
	'water_crimson_forest': '#3f76e4',
	'water_dark_forest': '#3f76e4',
	'water_deep_cold_ocean': '#3d57d6',
	'water_deep_dark': '#3f76e4',
	'water_deep_frozen_ocean': '#3938c9',
	'water_deep_lukewarm_ocean': '#45adf2',
	'water_deep_ocean': '#3f76e4',
	'water_desert': '#3f76e4',
	'water_dripstone_caves': '#3f76e4',
	'water_end_barrens': '#3f76e4',
	'water_end_midlands': '#3f76e4',
	'water_eroded_badlands': '#3f76e4',
	'water_flower_forest': '#3f76e4',
	'water_forest': '#3f76e4',
	'water_frozen_ocean': '#3938c9',
	'water_frozen_peaks': '#3f76e4',
	'water_frozen_river': '#3938c9',
	'water_grove': '#3f76e4',
	'water_ice_spikes': '#3f76e4',
	'water_jagged_peaks': '#3f76e4',
	'water_jungle': '#3f76e4',
	'water_lukewarm_ocean': '#45adf2',
	'water_lush_caves': '#3f76e4',
	'water_meadow': '#0e4ecf',
	'water_mushroom_fields': '#3f76e4',
	'water_nether_wastes': '#3f76e4',
	'water_ocean': '#3f76e4',
	'water_old_growth_birch_forest': '#3f76e4',
	'water_old_growth_pine_taiga': '#3f76e4',
	'water_old_growth_spruce_taiga': '#3f76e4',
	'water_plains': '#3f76e4',
	'water_river': '#3f76e4',
	'water_savanna': '#3f76e4',
	'water_savanna_plateau': '#3f76e4',
	'water_small_end_islands': '#3f76e4',
	'water_snowy_beach': '#3d57d6',
	'water_snowy_plains': '#3f76e4',
	'water_snowy_slopes': '#3f76e4',
	'water_snowy_taiga': '#3d57d6',
	'water_soul_sand_valley': '#3f76e4',
	'water_sparse_jungle': '#3f76e4',
	'water_stony_peaks': '#3f76e4',
	'water_stony_shore': '#3f76e4',
	'water_sunflower_plains': '#3f76e4',
	'water_swamp': '#617b64',
	'water_taiga': '#3f76e4',
	'water_the_end': '#3f76e4',
	'water_the_void': '#3f76e4',
	'water_warm_ocean': '#43d5ee',
	'water_warped_forest': '#3f76e4',
	'water_windswept_forest': '#3f76e4',
	'water_windswept_gravelly_hills': '#3f76e4',
	'water_windswept_hills': '#3f76e4',
	'water_windswept_savanna': '#3f76e4',
	'water_wooded_badlands': '#3f76e4'
}

function isTintColorArray(obj) {
	return obj && Array.isArray(obj) && obj.length == 3 && obj.every(e => typeof e === 'number');
}

(function() {
	var toggleTintAction;
	var setTintColorAction;
	var patchedCodecs = [];
	var openedDialog;

	/**
	 * Hook to patch textures when added
	 */
	function addTextureEvent(data) {
		if(isTintingFormat(Project.format)) {
			applyTintingShader(Project, data.texture);
		}
	} 

	/**
	 * Refreshes the tint for supported projects after parsing the model data
	 */
	function parsedEvent(data) {
		if(isTintingFormat(Project.format)) {
			updateTint();
		}
	}

	/** 
	 * Adds a parsed event to supported codes to trigger a refresh of the tinted elements.
	 * This is essentially a "completed loading" event, just a strange way to do it.
	 */
	function setupProjectEvent() {
		if(!isTintingFormat(Project.format)) {
			return;
		}
		for(let key in Codecs) {
			let codec = Codecs[key];
			if(codec.format && isTintingFormat(codec.format)) {
				codec.on('parsed', parsedEvent);
				patchedCodecs.safePush(codec);
			}
		}
		// Add to project format since it can be a fallback
		Codecs.project.on('parsed', parsedEvent);
		patchedCodecs.safePush(Codecs.project);
	}

	/**
	 * Hides the color picker dialog when switching projects
	 */
	function unselectProjectEvent(data) {
		if(openedDialog) {
			openedDialog.delete();
		}
	} 

	/**
	 * Causes any changes to face tint toggle to update the tint preview
	 */
	function finishEditEvent(data) {
		if(!isTintingFormat(Project.format)) {
			return;
		}
		let elements = data.aspects.elements;
		if(Undo.current_save.elements && Object.keys(Undo.current_save.elements).length && Array.isArray(elements) && elements.length) {
			let obj = data.aspects.elements[0];
			let oldObj = Undo.current_save.elements[obj.uuid];
			if(!obj.faces || !oldObj.faces)
				return;
			function faceTintChanged(a, b) {
				return a.tint != b.tint;
			}
			for(let f of Canvas.face_order) {
				if(faceTintChanged(obj.faces[f], oldObj.faces[f])) {
					updateTint();
					break;
				}
			}
		}
	}

	/**
	 * Causes undo and redo events related to face tint or deleted 
	 * element to trigger tint update.
	 */
	function undoRedoEvent(data) {
		if(!isTintingFormat(Project.format)) {
			return;
		}

		let beforeElements = data.entry.before.elements;
		if(typeof beforeElements !== 'object' || !beforeElements)
			return;

		let postElements = data.entry.post.elements;
		if(typeof postElements !== 'object' || !postElements)
			return;

		// Causes the tint to update if the undo/redo action was "Toggle face tint".
		if(Object.keys(beforeElements).length == Object.keys(postElements).length) {
			for(let key in beforeElements) {
				let beforeObj = beforeElements[key];
				let postObj = postElements[key];
				function faceTintChanged(a, b) {
					return a.tint != b.tint;
				}
				for(let f of Canvas.face_order) {
					if(faceTintChanged(beforeObj.faces[f], postObj.faces[f])) {
						updateTint();
						return;
					}
				}
			}
		} else if(!Object.keys(postElements).length) { // Elements were deleted
			for(let key in beforeElements) {
				let beforeObj = beforeElements[key];
				for(let f of Canvas.face_order) {
					function hasFaceTint(a) {
						return a.tint != -1;
					}
					if(hasFaceTint(beforeObj.faces[f])) {
						updateTint();
						return;
					}
				}
			}
		}
	}

	/**
	 * Loads the tint colour from the project file
	 */
	function loadProjectEvent(data) {
		if(!isTintingFormat(Project.format)) {
			return;
		}
		let tintColor = data.model.tint_color;
		if(isTintColorArray(tintColor)) {
			ProjectData[Project.uuid].tintColor = tintColor;
		}
	}

	/**
	 * Saves the tint colour to the project file
	 */
	function saveProjectEvent(data) {
		if(!isTintingFormat(Project.format)) {
			return;
		}
		let model = data.model;
		model.tint_color = getTintColor(Project);
	}

	/**
	 * Patches all textures in opened projects that support tinting with custom material. 
	 * Refer to #isTintingFormat(format) for the condition of a project to support tinting.
	 */
	function patchAllTextures() {
		if(!ModelProject.all.length)
			return;
		let count = 0;
		ModelProject.all.forEach(project => {
			if(isTintingFormat(project.format)) {
				let textures = project.textures;
				textures.forEach(texture => {
					applyTintingShader(project, texture);
					count++;
				});
			}
		});
		console.log(`[Tint Preview] Patched ${count} textures`);
	}

	/**
	 * Restores the original materials for all textures in opened projects. Any
	 * reminant materials (from closed projects) will simply be purged.
	 */
	function restoreOriginalMaterials() {
		if(ModelProject.all.length) {
			let count = 0;
			ModelProject.all.forEach(project => {
				if(isTintingFormat(project.format)) {
					let textures = project.textures;
					textures.forEach(texture => {
						let origMat = origMats[texture.uuid];
						if(origMat) {
							project.materials[texture.uuid] = origMat;
							count++;
						}
					});
				}
			});
			console.log(`[Tint Preview] Restored ${count} textures`);
		}
		origMats.purge();
	}

	Plugin.register('tint_preview', {
		title: 'Tint Preview',
		author: 'MrCrayfish',
		description: 'Preview a color on tint enabled faces! (JSON models only)',
		about: `The plugin adds the ability to preview a color on tint enabled cube faces. It adds two new options to the Tools menu that allows you to toggle tinting and change the tint color.
Important: This plugin is designed for JSON models only and will not work for other formats.`,
		tags: ["Minecraft: Java Edition"],
		icon: 'fa-fill',
		version: '1.1.0',
		variant: 'both',
		min_version: '4.3.0',
		onload() {
			// Custom translations. Am I doing this right?
			window.Language.addTranslations('en', {
				'dialog.tint_preview.set_tint_color': 'Set Tint Color',
				'panel.color.main_palette': 'Main Palette'
			});

			// Register events
			Blockbench.on('add_texture', addTextureEvent);
			Blockbench.on('unselect_project', unselectProjectEvent);
			Blockbench.on('finish_edit', finishEditEvent);
			Blockbench.on('setup_project', setupProjectEvent);
			Blockbench.on('load_project', loadProjectEvent);
			Blockbench.on('save_project', saveProjectEvent);
			Blockbench.on('undo', undoRedoEvent);
			Blockbench.on('redo', undoRedoEvent);

			// Patches all current textures loaded in valid porjects
			patchAllTextures(); 

			// Setup state memory
			StateMemory.init('tint_color_picker_tab', 'string');
			StateMemory.init('tint_color_wheel', 'boolean');
			StateMemory.init('show_tint', 'boolean');

			toggleTintAction = new Toggle('toggle_tint_preview', {
				name: 'Show Tint Color',
				icon: (StateMemory.show_tint ? 'fa-fill-drip' : 'fa-fill'),
				description: 'Toggles the tint effect for tint enabled faces',
				category: 'tools',
				default: StateMemory.show_tint,
				condition: () => isTintingFormat(Format),
				onChange: (state) => {
					StateMemory.show_tint = state;
					StateMemory.save('show_tint');
					updateTint(true);
				}
			});

			setTintColorAction = new Action({
				id: 'set_tint_color',
				name: 'Set Tint Color',
				icon: 'fa-palette',
				description: 'Toggles the tint effect for tint enabled faces',
				category: 'tools',
				condition: () => isTintingFormat(Format),
				click: () => {
					openedDialog = createTintColorDialog();
					openedDialog.show();
					$('#blackout').hide();
					open_dialog = false; // Hack to allow keybinds to pass through dialog
				}
			});

			// Adds the actions to the tools menu
			MenuBar.addAction(toggleTintAction, 'tools');
			MenuBar.addAction(setTintColorAction, 'tools');
			MenuBar.update();

			updateTint(true);
		},
		onunload() {
			toggleTintAction.delete();
			setTintColorAction.delete();
			if(openedDialog) openedDialog.delete();
			restoreOriginalMaterials();
			Blockbench.removeListener('add_texture', addTextureEvent);
			Blockbench.removeListener('unselect_project', unselectProjectEvent);
			Blockbench.removeListener('finish_edit', finishEditEvent);
			Blockbench.removeListener('setup_project', setupProjectEvent);
			Blockbench.removeListener('load_project', loadProjectEvent);
			Blockbench.removeListener('save_project', saveProjectEvent);
			Blockbench.removeListener('undo', undoRedoEvent);
			Blockbench.removeListener('redo', undoRedoEvent);
			patchedCodecs.forEach(codec => codec.removeListener('parsed', parsedEvent));
			clearTint();
		}
	});
})();

function createTintColorDialog(project = Project) {

	// Gets the current tint color for the project
	let rgb = getTintColor(project);
	let tintColor = new tinycolor({
		r: Math.round(Math.clamp(rgb[0] * 255, 0, 255)), 
		g: Math.round(Math.clamp(rgb[1] * 255, 0, 255)),
		b: Math.round(Math.clamp(rgb[2] * 255, 0, 255))
	});

	// Create dialog
	let colorPickerDialog = new Dialog({
		id: 'select_tint_color_dialog',
		title: 'dialog.tint_preview.set_tint_color',
		singleButton: true,
		width: 400,
		darken: false,
		component: {
			data: {
				width: 352,
				open_tab: StateMemory.tint_color_picker_tab || 'picker',
				picker_type: StateMemory.tint_color_wheel ? 'wheel' : 'box',
				picker_toggle_label: tl('panel.color.picker_type'),
				text_input: tintColor.toHexString(),
				tint_color: tintColor.toHexString(),
				hover_color: '',
				selected_preset: 'empty',
				color_presets: blockColorOptions,
				get color_code() {
					return this.hover_color || this.tint_color
				},
				set color_code(value) {
					this.tint_color = value.toLowerCase().replace(/[^a-f0-9#]/g, '');
				},
				// Just use the palette/history from main color picker. Maybe in a future update it'll be separate
				palette: Interface.Panels.color.vue._data.palette,
				history: Interface.Panels.color.vue._data.history
			},
			methods: {
				togglePickerType() {
					StateMemory.tint_color_wheel = !StateMemory.tint_color_wheel;
					StateMemory.save('tint_color_wheel');
					this.picker_type = StateMemory.tint_color_wheel ? 'wheel' : 'box';
					Vue.nextTick(() => {
						$('#tint_colorpicker').spectrum('reflow');
					});
				},
				sort(event) {
					var item = this.palette.splice(event.oldIndex, 1)[0];
					this.palette.splice(event.newIndex, 0, item);
				},
				drop(event) {
				},
				setColor(color) {
					colorPickerDialog.set(color, true);
				},
				validateTintColorAndUpdate() {
					var color = this.text_input;
					if (!color.match(/^#[0-9a-f]{6}$/)) {
						this.tint_color = tinycolor(color).toHexString();
					}
					setTintColor(new tinycolor(this.tint_color), true);
				},
				isDarkColor(hex) {
					if (hex) {
						let color_val = new tinycolor(hex).getBrightness();
						let bg_val = new tinycolor(CustomTheme.data.colors.back).getBrightness();
						return Math.abs(color_val - bg_val) <= 50;
					}
				},
				onWheelColorChange(value) {
					let color = new tinycolor(value);
					this.tint_color = color.toHexString();
					dragTintColor = convertTintToRgbArray(color);
					updateTint();
				},
				tl
			},
			watch: {
				tint_color: function(value) {
					this.hover_color = '';
					$('#tint_colorpicker').spectrum('set', value);
					this.text_input = value;
				},
				open_tab(tab) {
					StateMemory.tint_color_picker_tab = tab;
					StateMemory.save('tint_color_picker_tab');
					Vue.nextTick(() => {
						$('#tint_colorpicker').spectrum('reflow');
					});
				},
				selected_preset: function(value) {
					dragTintColor = null;
					let color = blockColorValues[value];
					if(color) {
						this.tint_color = color;
						setTintColor(new tinycolor(this.tint_color), true);
					}
				}
			},
			template: `
				<div id="tint_color_panel_wrapper" class="panel_inside">
					<div id="color_panel_head">
						<div class="main" v-bind:style="{'background-color': hover_color || tint_color}"></div>
						<div class="side">
							<input type="text" v-model="color_code" @focusout="validateTintColorAndUpdate()">
							<div id="color_history">
								<li
									v-for="(color, i) in history" v-if="i || color != tint_color"
									:key="color"
									v-bind:style="{'background-color': color}"
									v-bind:title="color" @click="setColor(color)"
								></li>
							</div>
						</div>
					</div>

					<div class="bar tabs_small">

						<input type="radio" name="tab" id="radio_tint_color_picker" value="picker" v-model="open_tab">
						<label for="radio_tint_color_picker">${tl('panel.color.picker')}</label>

						<input type="radio" name="tab" id="radio_tint_color_palette" value="palette" v-model="open_tab">
						<label for="radio_tint_color_palette">${tl('panel.color.main_palette')}</label>

						<input type="radio" name="tab" id="radio_tint_color_both" value="both" v-model="open_tab">
						<label for="radio_tint_color_both">${tl('panel.color.both')}</label>

						<div class="tool" @click="togglePickerType()" :title="picker_toggle_label">
							<i class="fa_big icon" :class="picker_type == 'box' ? 'fas fa-square' : 'far fa-stop-circle'"></i>
						</div>

					</div>
					<div v-show="open_tab == 'picker' || open_tab == 'both'">
						<div v-show="picker_type == 'box'" ref="square_picker" :width="width">
							<input id="tint_colorpicker">
						</div>
						<color-wheel ref="color_wheel" v-if="picker_type == 'wheel' && width" v-model="tint_color" :width="width" :height="width" v-on:color-change="onWheelColorChange($event)"></color-wheel>
					</div>
					<div v-show="open_tab == 'palette' || open_tab == 'both'">
						<div class="toolbar_wrapper palette" toolbar="palette"></div>
						<ul id="palette_list" class="list" v-sortable="{onUpdate: sort, onEnd: drop, fallbackTolerance: 10}" @contextmenu="ColorPanel.menu.open($event)">
							<li
								class="color" v-for="color in palette"
								:title="color" :key="color"
								:class="{selected: color == tint_color, contrast: isDarkColor(color)}"
								@click="setColor(color)"
								@mouseenter="hover_color = color"
								@mouseleave="hover_color = ''"
							>
								<div class="color_inner" v-bind:style="{'background-color': color}"></div>
							</li>
						</ul>
					</div>
					<div style="font-size: 0.94em;">Presets</div>
					<div class="bar_select">
						<select-input v-model="selected_preset" :options="color_presets""/>
					</div>
				</div>
			`,
			mounted() {
				// Initialize spectrum and add dragstop event
				let colorPicker = $(this.$el).find('#tint_colorpicker').spectrum({
					preferredFormat: "hex",
					flat: true,
					color: tintColor,
					move: function(color) {
						colorPickerDialog.set(color);
						dragTintColor = convertTintToRgbArray(color);
						updateTint();
					}
				});
				$(colorPicker).on("dragstop.spectrum", function(e, color) {
					colorPickerDialog.set(color);
					dragTintColor = null;
					setTintColor(color, true);
				});

				// Adds a mouse up listener to the color wheel
				let scope = this;
				function colorWheelMouseUp(event) {
					document.removeEventListener('mouseup', colorWheelMouseUp);
					let color = new tinycolor(scope.$refs.color_wheel.color);
					colorPickerDialog.set(color);
					dragTintColor = null;
					setTintColor(color, true);
				}
				$(this.$el).find('#color-wheel').on('mousedown', function(event) {
					document.addEventListener('mouseup', colorWheelMouseUp);
				});

				// Fixes an issue on first load where the marker is in the wrong position
				Vue.nextTick(() => {
					$(colorPicker).spectrum('reflow');
				});
			}
		}
	});
	colorPickerDialog.set = function(color) {
		var value = new tinycolor(color);
		colorPickerDialog.content_vue._data.tint_color = value.toHexString();
	}
	colorPickerDialog.get = function() {
		return colorPickerDialog.content_vue._data.tint_color;
	}
	return colorPickerDialog;
}

/* Converts tinycolor to rgb array in the range of [0, 1]*/
function convertTintToRgbArray(color) {
	let rgb = color.toRgb();
	let r = Math.clamp(rgb.r / 255.0, 0.0, 1.0);
	let g = Math.clamp(rgb.g / 255.0, 0.0, 1.0);
	let b = Math.clamp(rgb.b / 255.0, 0.0, 1.0);
	return [r, g, b];
}

// Accepts a tinycolor
function setTintColor(color, save = false) {
	let rgb = convertTintToRgbArray(color);
	ProjectData[Project.uuid].tintColor = rgb;
	if(save) Project.saved = false;
	updateTint();
}

/**
 * Gets the tint color for the given project. This returns an array in
 * in the format of [r, g, b]. If no project is specified, the current is used.
 */
function getTintColor(project = Project) {
	if(dragTintColor && isTintColorArray(dragTintColor)) {
		return dragTintColor;
	}
	let tintColor = ProjectData[project.uuid].tintColor;
	if(!isTintColorArray(tintColor)) {
		ProjectData[project.uuid].tintColor = defaultTintColor;
		tintColor = defaultTintColor;
	}
	return tintColor;
}

/**
 * Updates the color atrribute on the cube geometry. Faces that that have tint
 * enabled will recieve the tint color while other faces will just recieve a
 * white tint.
 */
function updateTint(force = false) {
	if(!StateMemory.show_tint && !force)
		return;
	Outliner.elements.forEach(obj => {
		const geometry = obj.mesh.geometry;
		const positionAttribute = geometry.getAttribute('position');
		const colors = new Array(positionAttribute.count * 3);
		colors.fill(1); // Fill with white
		function setFaceTintColor(face, rgb) {
			let index = Canvas.face_order.indexOf(face);
			if(index == -1) return;
			let startIndex = index * 12;
			for(let i = 0; i < 12; i++) {
	            colors[startIndex + i] = rgb[i % 3];
		    }
		}
		let tintColor = getTintColor();
		for(let key in obj.faces) {
			let face = obj.faces[key];
			if(face.tint != -1 && StateMemory.show_tint) {
				setFaceTintColor(face.direction, tintColor);
			} else {
				setFaceTintColor(face.direction, [1.0, 1.0, 1.0]);
			}
		}
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
		obj.preview_controller.updateFaces(obj);
	});
}

/**
 * Removes the tint from obj geometry. Only called when uninstalling plugin
 */
function clearTint() {
	Outliner.elements.forEach(obj => {
		const geometry = obj.mesh.geometry;
		geometry.deleteAttribute('color');
		obj.preview_controller.updateFaces(obj);
	});
}

/**
 * Patches the texture in the given project with a custom material. The shader
 * has been based on the original texture shader, just with the inclusion to 
 * apply a vertex color. The tint calculation is the same as Minecraft, that being
 * "texture * tint".
 */
function applyTintingShader(project, texture) {
	var originalMat = project.materials[texture.uuid];
	var vertShader = `
		attribute float highlight;

		uniform bool SHADE;
		uniform int LIGHTSIDE;

		varying vec3 vColor;
		varying vec2 vUv;
		varying float light;
		varying float lift;

		float AMBIENT = 0.5;
		float XFAC = -0.15;
		float ZFAC = 0.05;

		void main() {
			if (SHADE) {
				vec3 N = normalize(vec3(modelMatrix * vec4(normal, 0.0)));
				if (LIGHTSIDE == 1) {
					float temp = N.y;
					N.y = N.z * -1.0;
					N.z = temp;
				}
				if (LIGHTSIDE == 2) {
					float temp = N.y;
					N.y = N.x;
					N.x = temp;
				}
				if (LIGHTSIDE == 3) {
					N.y = N.y * -1.0;
				}
				if (LIGHTSIDE == 4) {
					float temp = N.y;
					N.y = N.z;
					N.z = temp;
				}
				if (LIGHTSIDE == 5) {
					float temp = N.y;
					N.y = N.x * -1.0;
					N.x = temp;
				}
				float yLight = (1.0 + N.y) * 0.5;
				light = yLight * (1.0 - AMBIENT) + N.x * N.x * XFAC + N.z * N.z * ZFAC + AMBIENT;
			} else {
				light = 1.0;
			}
			if (highlight == 2.0) {
				lift = 0.22;
			} else if (highlight == 1.0) {
				lift = 0.1;
			} else {
				lift = 0.0;
			}
			vColor = color;
			vUv = uv;
			vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
			gl_Position = projectionMatrix * mvPosition;
		}`
	var fragShader = `
		#ifdef GL_ES
		precision ${isApp ? 'highp' : 'mediump'} float;
		#endif

		uniform sampler2D map;

		uniform bool SHADE;
		uniform bool EMISSIVE;
		uniform vec3 LIGHTCOLOR;

		varying vec3 vColor;
		varying vec2 vUv;
		varying float light;
		varying float lift;

		void main(void) {
			
			vec4 color = texture2D(map, vUv);
			if (color.a < 0.01) 
				discard;
			if (EMISSIVE == false) {
				color = vec4(lift + color.rgb * light, color.a);
				color.r = color.r * LIGHTCOLOR.r;
				color.g = color.g * LIGHTCOLOR.g;
				color.b = color.b * LIGHTCOLOR.b;
			} else {
				float light_r = (light * LIGHTCOLOR.r) + (1.0 - light * LIGHTCOLOR.r) * (1.0 - color.a);
				float light_g = (light * LIGHTCOLOR.g) + (1.0 - light * LIGHTCOLOR.g) * (1.0 - color.a);
				float light_b = (light * LIGHTCOLOR.b) + (1.0 - light * LIGHTCOLOR.b) * (1.0 - color.a);
				color = vec4(lift + color.r * light_r, lift + color.g * light_g, lift + color.b * light_b, 1.0);
			}
			if (lift > 0.2) {
				color.r = color.r * 0.6;
				color.g = color.g * 0.7;
			}
			vec4 tint = vec4(vColor.rgb, 1.0);
			gl_FragColor = color * tint;
		}`
	var mat = new THREE.ShaderMaterial({
		uniforms: {
			map: {type: 't', value: originalMat.map},
			SHADE: {type: 'bool', value: settings.shading.value},
			LIGHTCOLOR: {type: 'vec3', value: new THREE.Color().copy(Canvas.global_light_color).multiplyScalar(settings.brightness.value / 50)},
			LIGHTSIDE: {type: 'int', value: Canvas.global_light_side},
			EMISSIVE: {type: 'bool', value: texture.render_mode == 'emissive'}
		},
		vertexShader: vertShader,
		fragmentShader: fragShader,
		side: Canvas.getRenderSide(),
		vertexColors: true,
		transparent: true,
	});
	mat.map = originalMat.map;
	mat.name = texture.name;
	project.materials[texture.uuid] = mat;

	// Store the original mat for restoring
	origMats[texture.uuid] = originalMat;
}

/**
 * Checks if the format supports tinting. Support for other formats can be added by
 * adding "allowTinting = true" onto the format instance on creation.
 */
function isTintingFormat(format) {
	return format.id == 'java_block' || format.allowTinting;
}
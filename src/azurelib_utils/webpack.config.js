/**
 * This module is a fork of the GeckoLib Animation Utils plugin and modified for use in the Azurelib fork.
 * Original source:
 * https://github.com/JannisX11/blockbench-plugins/tree/034ed058efa5b2847fb852e3b215aad372080dcf/src/animation_utils 
 * Copyright © 2024 Bernie-G. Licensed under the MIT License.
 * https://github.com/JannisX11/blockbench-plugins/blob/main/LICENSE
 */

const PathModule = require('path')

module.exports = {
    mode: 'production',
    target: 'node',
    entry: './index.js',
    output: {
        filename: 'azurelib_utils.js',
        path: PathModule.resolve(__dirname, '../../plugins/azurelib_utils')
    }
}

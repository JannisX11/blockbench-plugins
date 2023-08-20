const PathModule = require('path')

module.exports = {
    mode: 'development',
    devtool: 'none',
    target: 'node',
    entry: './index.js',
    output: {
        filename: 'animation_utils.js',
        path: PathModule.resolve(__dirname, '../../plugins')
    }
}

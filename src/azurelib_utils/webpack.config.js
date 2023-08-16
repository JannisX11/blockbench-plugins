const PathModule = require('path')

module.exports = {
    mode: 'production',
    target: 'node',
    entry: './index.js',
    output: {
        filename: 'azurelib_utils.js',
        path: PathModule.resolve(__dirname, '../../plugins')
    }
}

const PathModule = require('path')

module.exports = {
    mode: 'development',
    devtool: false,
    target: 'node',
    entry: './index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'animation_utils.js',
        path: PathModule.resolve(__dirname, '..')
    }
}

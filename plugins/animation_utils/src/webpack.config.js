const PathModule = require('path')

module.exports = {
    mode: 'development',
    devtool: false,
    target: 'node',
    entry: './ts/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [ 'to-string-loader', 'css-loader' ]
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

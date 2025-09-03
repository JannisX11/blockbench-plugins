const PathModule = require('path')

module.exports = {
    mode: 'development',
    devtool: false,
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
        filename: 'geckolib.js',
        path: PathModule.resolve(__dirname, '..')
    }
}

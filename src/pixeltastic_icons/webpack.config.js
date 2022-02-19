const PathModule = require('path');

module.exports = {
	mode: 'development',
	devtool: 'none',
	target: 'node',
	entry: './main.js',
	output: {
		filename: 'pixeltastic_icons.js',
		path: PathModule.resolve(__dirname, '../../plugins')
	},
    module: {
        rules: [
            {
                test: /\.png$/,
                use: {
                    loader: 'url-loader'
                }
            }
        ]
    }
}

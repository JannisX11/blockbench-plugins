const path = require('path');

module.exports = {
  entry: './src/index.ts',
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
    filename: 'baked_ambient_occlusion.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'umd',
    },
    globalObject: 'this',
  },
  externals: {
    // These are provided by Blockbench globally
    'blockbench': 'Blockbench',
  },
  optimization: {
    minimize: true,
  },
};
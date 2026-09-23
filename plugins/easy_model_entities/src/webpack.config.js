/*
 * Copyright 2026 Markus Bordihn
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
 * NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'easy_model_entities.js',
    path: path.resolve(__dirname, '..')
  },
  target: 'node',
  module: {
    rules: [
      {test: /\.svg$/, type: 'asset/source'},
      {test: /\.md$/, type: 'asset/source'}
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {from: './LICENSE.MD', to: './LICENSE.MD', noErrorOnMissing: true},
        {from: './resources/icon.png', to: './icon.png', noErrorOnMissing: true}
      ]
    })
  ],
  mode: 'production',
  optimization: {
    minimize: false
  }
};

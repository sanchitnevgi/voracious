const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src', 'scripts', 'contentscript.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'contentscript.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/icons', to: 'icons' },
      { from: 'src/_locales', to: '_locales' },
      { from: 'manifest.json' },
    ])
  ]
}

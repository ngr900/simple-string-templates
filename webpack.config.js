const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/simple-string-templates.js',
  plugins: [
    new CleanWebpackPlugin()
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'simple-string-templates.js',
    library: 'simple-string-templates',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
};
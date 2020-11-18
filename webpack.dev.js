const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    watchContentBase: true,
    publicPath: '/public',
    compress: true,
    port: 3000
  }
});

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
      index: './src/index.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  plugins: [
    new HtmlWebpackPlugin({
        title: 'Aquarium Simulation',
        filename: 'index.html',
        publicPath: './public',
        template: 'template.html',
        favicon: 'favicon.ico',
        meta: {
            'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no',
            'description': 'A simulation of real-world aquarium with environment and flocking behavior.',
            'copyright': 'Junyi Cheng'
        }
    })
  ],
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: ['babel-loader'],
      resolve: {
        extensions: ['.js', '.jsx']
      }
  }, {
      test: /\.css$/i,
      use: ['style-loader', 'css-loader']
  }]
  }
};

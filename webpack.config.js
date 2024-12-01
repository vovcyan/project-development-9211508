const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Webpack configuration
const config = {
  // Entrypoint file
  entry: './ui/index.jsx',
  // Definition of directory where application bundle will be generated
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      // All js and jsx file must transformed using babel-loader, except node modules
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      // All css files must be transformed using style-loader, css-loader, and postcss-loader
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ]
  },
  plugins: [
    // HTML plugin generates index.html file which loads application bundle
    new HtmlWebpackPlugin({
      template: './ui/index.html',
    }),
  ]
};

module.exports = config;
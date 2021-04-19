const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

const htmlPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html',
});

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  entry: './src/index.jsx',
  mode: isDev ? process.env.NODE_ENV : 'production',
  plugins: [htmlPlugin],
  resolve: {
    extensions: ['.js', 'css', 'scss'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[hash].js',
    publicPath: '/',
  },
  devtool: 'source-map',
  watch: true,
};

const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

const htmlPlugin = new HtmlWebPackPlugin({
  template: './index.html',
  filename: './index.html',
});

const config = {
  mode: 'development',
  entry: './index.jsx',
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      components: path.resolve(__dirname, 'components/'),
      features: path.resolve(__dirname, 'features/'),
      hooks: path.resolve(__dirname, 'hooks/'),
      routes: path.resolve(__dirname, 'routes/'),
      apis: path.resolve(__dirname, 'apis/'),
    },
  },
  output: {
    filename: 'bundle.[chunkhash].js',
    path: path.resolve(__dirname, 'dist/'),
  },
  devServer: {
    contentBase: 'dist',
    hot: true,
    port: 8080,
    inline: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.js$|jsx/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true, // webpack@2.x and newer
            },
          },
        ],
      },
    ],
  },
  plugins: [htmlPlugin],
};

module.exports = config;

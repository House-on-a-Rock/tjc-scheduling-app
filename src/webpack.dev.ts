import { Configuration } from 'webpack';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import path from 'path';

const htmlPlugin = new HtmlWebPackPlugin({
  template: './index.html',
  filename: './index.html',
});

console.log(path.join(__dirname, 'dist'));

const config: Configuration = {
  mode: 'development',
  entry: './index.tsx',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.[hash].js',
  },
  // devServer: {
  //   port: 8080,
  //   inline: true,
  //   writeToDisk: true,
  // },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
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

export default config;

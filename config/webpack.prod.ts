import path from 'path';
import { merge } from 'webpack-merge';
import commonConfig from './webpack.common';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const prodConfig: any = {
  mode: 'production',
  output: {
    publicPath: '/',
    filename: 'bundle.js',
    path: path.resolve(__dirname, '..', 'build'),
    // pathinfo: true,
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
        use: [
          // MiniCssExtractPlugin.loader,
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  // plugins: [
  //   new MiniCssExtractPlugin({
  //     filename: '[name].css',
  //     chunkFilename: '[id].css',
  //   })
  // ],
};

module.exports = merge(commonConfig, prodConfig);
import { merge } from 'webpack-merge';
import commonConfig from './webpack.common';
import * as webpack from 'webpack';
import 'webpack-dev-server';

interface DevConfig {
  mode: 'development' | 'production',
  output: any,
  devServer: any,
  plugins: any
}

import { Configuration, HotModuleReplacementPlugin } from "webpack";

const devConfig: any = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new HotModuleReplacementPlugin(),
  ],
  devServer: {
    historyApiFallback: true,
    port: 4000,
    open: true,
    hot: true,
    proxy: [
      {
        context: [
          '/auth',
          '/inbox',
          '/teammates',
          '/channels',
          '/templates',
          '/projects',
        ],
        target: 'http://localhost:3005',
      },
    ],
  },
};

export default merge(commonConfig, devConfig);
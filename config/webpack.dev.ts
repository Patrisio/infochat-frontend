import { merge } from 'webpack-merge';
import commonConfig from './webpack.common';
import 'webpack-dev-server';
import { HotModuleReplacementPlugin } from "webpack";
import { localBackendHost } from '../src/lib/utils/constants'; 

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
    port: 3001,
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
        target: localBackendHost,
      },
    ],
  },
};

export default merge(commonConfig, devConfig);
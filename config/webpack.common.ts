import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import * as webpack from 'webpack';

const commonConfig: any = {
  entry: path.join(__dirname, '..', 'src', 'index.tsx'),
  output: {
    publicPath: '/',
  },
  module: {
    rules: [
      // {
      //   test: /\.(png|jpe?g|webp|git|svg|)$/i,
      //   use: [
      //     {
      //       loader: 'img-optimize-loader',
      //     },
      //   ],
      // },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          'file-loader',
        ]
      },
      {
        test: /\.svg$/,
        use: [
          'file-loader',
          'svgo-loader'
        ]
      },
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
              ['@babel/plugin-proposal-decorators', { legacy: true }],
            ],
          },
        },
      },
    ],
  },
  performance: {
    hints: false,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      ui: path.resolve(__dirname, '..', 'src', 'components'),
      hooks: path.resolve(__dirname, '..', 'src', 'hooks'),
      lib: path.resolve(__dirname, '..', 'src', 'lib'),
      assets: path.resolve(__dirname, '..', 'src', 'assets'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', 'public', 'index.html'),
    }),
  ],
};

export default commonConfig;
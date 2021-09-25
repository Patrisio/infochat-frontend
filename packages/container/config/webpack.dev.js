const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const commonConfig = require('./webpack.common');
const packageJson = require('../package.json');

const devConfig = {
  mode: 'development',
  output: {
    publicPath: 'http://localhost:8080/',
  },
  devServer: {
    port: 8080,
    historyApiFallback: {
      index: 'index.html',
    },
    proxy: {
      '/': 'http://localhost:3005',
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      exposes: {
        './useActions': './src/hooks/useActions',
        './useForm': './src/hooks/useForm',
        './usePrevious': './src/hooks/usePrevious',
        './useTypedSelector': './src/hooks/useTypedSelector',

        './Input': './src/components/Input/Input',
        './Button': './src/components/Button/Button',

        './token': './src/lib/utils/token',

        './Response': './src/api/types',
      },
      remotes: {
        auth: 'auth@http://localhost:8082/remoteEntry.js',
      },
      shared: {
        ...packageJson.dependencies,
        react: { singleton: true, eager: true, requiredVersion: packageJson.dependencies.react },
        "react-dom": { singleton: true, eager: true, requiredVersion: packageJson.dependencies["react-dom"] },
        "react-router-dom": { singleton: true, eager: true, requiredVersion: packageJson.dependencies["react-router-dom"] }
      }
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);

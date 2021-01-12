import TerserPlugin from 'terser-webpack-plugin';
import { WebpackConfig } from '@beemo/driver-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import path from 'path';
import { ASSET_EXT_PATTERN, TJSX_EXT_PATTERN } from '../constants';
import { getSettings } from '../helpers';

const PROD = process.env.NODE_ENV === 'production';

const { buildFolder = 'public', srcFolder = 'src', react = false } = getSettings();

const root = process.cwd();
const port = process.env.PORT || 8081;
const srcPath = path.join(root, srcFolder);
const publicPath = path.join(root, buildFolder);
const entry = [srcPath];

const plugins = [
  new webpack.NamedChunksPlugin(),
  new webpack.EnvironmentPlugin({
    LAZY_LOAD: false,
    RENDER_ENV: 'browser',
    SILENCE_POLYGLOT_WARNINGS: true,
    AMP: false
  }),
  new webpack.DefinePlugin({
    __DEV__: JSON.stringify(!PROD)
  }),
  new HtmlWebpackPlugin({
    chunks: ['runtime', 'core'],
    template: `{$srcDir}/index.html`,
    filename: 'index.html',
    favicon: ''
  })
];

if (!PROD && react) {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
  );
}

const config : WebpackConfig = {
  mode: PROD ? 'production' : 'development',

  bail: PROD,

  context: root,

  entry: {
    core: entry
  },

  plugins,

  module: {
    rules: [
      {
        test: TJSX_EXT_PATTERN,
        include: [srcPath],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            configFile: true,
          },
        },
      },
      {
        test: ASSET_EXT_PATTERN,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1000,
            name: 'assets/[name].[ext]?[hash:7]',
            publicPath: '/',
          },
        },
      },
    ],
  },

  output: {
    path: publicPath,
    publicPath: '/',
    filename: PROD ? 'assets/[name].[contenthash].js' : 'assets/[name].js',
    chunkFilename: PROD ? 'assets/[name].[contenthash].chunk.js' : 'assets/[name].[id].js',
    sourceMapFilename: '[file].map',
  },

  devtool: PROD ? 'source-map' : 'cheap-module-source-map',

  // @ts-ignore
  devServer: {
    compress: true,
    contentBase: publicPath,
    disableHostCheck: true,
    historyApiFallback: true,
    hot: true,
    port,
    watchOptions: {
      ignored: /node_modules/,
    }
  },

  optimization: {
    runtimeChunk: 'single',
    minimize: PROD,
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
        parallel: true,
      }),
    ],
  },

  performance: false,

  stats: !PROD,
};

export default config;

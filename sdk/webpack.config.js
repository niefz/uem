/**
 * Created by niefz on 2018/1/8.
 */
const { resolve } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { version } = require('./package.json');

const BUILD_PATH = resolve(__dirname, 'dist');

module.exports = {
  mode: 'production',
  entry: './src/web/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /src/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              sourceMap: true,
              cacheDirectory: true,
            },
          },
        ],
      },
    ],
  },
  output: {
    path: BUILD_PATH,
    publicPath: '/dist',
    filename: `uem.min.js?v=${version}`,
    library: 'uem-sdk',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
};

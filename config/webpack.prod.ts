import * as webpack from 'webpack';
import * as path from 'path';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as Merge from 'webpack-merge';
import * as helpers from './helpers';
import * as CompressionPlugin from 'compression-webpack-plugin';

import webpackCommonConfig from './webpack.common';
declare const __dirname: string;

const PORT: number = 2222;

const config: webpack.Configuration = Merge(webpackCommonConfig, {
  entry: {
    app: helpers.resolve('../src/main-aot.ts')
  },
  output: {
    filename: 'scripts/[name].[chunkhash:16].js',
    chunkFilename: 'scripts/[id].[name]-[chunkhash:16].chunk.js',
    publicPath: `http://localhost:${PORT}/`
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [
          /\.(spec|e2e)\.ts$/
        ],
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: helpers.resolve('../tsconfig.json')
            }
          },
          {
            loader: 'angular-router-loader',
            options: {
              aot: true,
              debug: true,
              genDir: './compiled/aot'
            }
          },
          'angular2-template-loader'
        ]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
    ]
  },

  plugins: [
    new ExtractTextPlugin({
      filename: 'styles/[name].[contenthash:16].css'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      beautify: false,
      mangle: {
        screw_ie8: true
      },
      compress: {
        unused: true,
        dead_code: true,
        drop_debugger: true,
        conditionals: true,
        evaluate: true,
        drop_console: true,
        sequences: true,
        booleans: true,
        screw_ie8: true,
        warnings: false
      },
      comments: false
    }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    }),
  ]
});

export default config;

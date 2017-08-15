import * as webpack from 'webpack';
import * as path from 'path';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as Merge from 'webpack-merge';
import * as helpers from './helpers';
declare const __dirname: string;

const AOT = process.env.BUILD_AOT;

console.log('AOT', AOT);

const config: webpack.Configuration = {
  context: helpers.resolve('../'),
  cache: true,
  entry: {
    app: AOT ? './src/main-aot.ts' : './src/main.ts'
  },

  output: {
    path: helpers.resolve('../dist'),
    sourceMapFilename: '[name].map'
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: [path.join(__dirname, '../src'), 'node_modules'],
    alias: {
      // '@angular': AOT ? helpers.resolve('../compiled/aot/node_modules/@angular') : helpers.resolve('../node_modules/@angular'),
      '@angular': helpers.resolve('../node_modules/@angular'),
      'material-design-icons': helpers.resolve('../node_modules/material-design-icons'),
      'root': helpers.resolve('..'),
      'common': helpers.resolve('../src/common'),
      'services': helpers.resolve('../src/services'),
      'app': helpers.resolve('../src/modules/app')
    }
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [
          /node_modules/,
          /\.(spec|e2e)\.ts$/
        ],
        use: [
          'awesome-typescript-loader',
          {
            loader: 'angular-router-loader',
            options: {
              aot: AOT,
              genDir: './compiled/aot'
            }
          },
          'angular2-template-loader'
        ]
      },
      {
        test: /\.(html|css)$/,
        use: 'raw-loader',
        exclude: /\.async\.(html|css)$/
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'polyfills'],
      chunks: ['app'],
      minChunks: module => /node_modules/.test(module.resource)
    }),
    //解决打包编译时，循环依赖的错误
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      path.resolve(__dirname, '../src')
    )
  ]
}

export default config;

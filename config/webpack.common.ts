import * as webpack from 'webpack';
import * as path from 'path';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as Merge from 'webpack-merge';
import * as helpers from './helpers';
declare const __dirname: string;

const config: webpack.Configuration = {
  entry: {
    app: helpers.resolve('../src/main.ts'),
    vendor: helpers.resolve('../src/vendor.ts'),
    polyfills: helpers.resolve('../src/polyfills.ts')
  },

  output: {
    path: helpers.resolve('../dist')
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
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
      names: ['polyfills', 'vendor'],
      minChunks: Infinity
    }),
    //解决打包编译时，循环依赖的错误
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      path.resolve(__dirname, '../src')
    )
  ]
}

export default config;

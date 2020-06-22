const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv').config();
const workboxPlugin = require('workbox-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

module.exports = {
  entry: ['./src/main.js','./src/styles.css'],
  output: {
    publicPath: "/",
    filename: 'main.js',
    path: path.resolve(__dirname, '..', 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@upradio-client': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: "awesome-typescript-loader", exclude: /node_modules/ },
      { test: /\.html?$/, loader: "raw-loader" },
      { test: /\.css$/, use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader'
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  performance: {
    maxEntrypointSize: 1048576,
    maxAssetSize: 1048576
  },
  plugins: [
    new CleanWebpackPlugin(),
    new htmlPlugin({ filename: 'index.html', template: './index.html' }),
    new MiniCssExtractPlugin({ filename: 'main.css' }),
    new webpack.DefinePlugin({
      'process.env.PEER_SERVER': JSON.stringify(dotenv.parsed.PEER_SERVER),
      'process.env.PEER_PATH': JSON.stringify(dotenv.parsed.PEER_PATH),
      'process.env.PEER_KEY': JSON.stringify(dotenv.parsed.PEER_KEY),
      'process.env.MAX_CONNECTIONS': JSON.stringify(dotenv.parsed.MAX_CONNECTIONS)
    }),
    new CopyPlugin({
      patterns: [
        { from: 'manifest.webmanifest', to: 'manifest.webmanifest' },
        { from: 'images', to: 'images' },
        { from: 'favicon.ico', to: 'favicon.ico' },
        { from: 'robots.txt', to: 'robots.txt' }
      ]
    }),
    new workboxPlugin.GenerateSW({
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true,
    })  
    // new workboxPlugin.InjectManifest({
    //   swSrc: './src/sw.js',
    //   swDest: 'sw.js'
    // })
  ]
};

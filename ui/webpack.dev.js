const webpack = require('webpack');
const path = require('path');
const config = require('./webpack.config');

config.devtool = 'source-map';
config.mode = 'development';
config.devServer = {
  contentBase: path.join(__dirname, 'dist'),
  compress: true,
  port: 1234,
  host: '0.0.0.0',
  proxy: {
    '/api': 'https://upradio.iangregson.workers.dev'
  }
};
config.plugins.unshift(
  new webpack.DefinePlugin({
    'process.env.DEBUG_LEVEL': JSON.stringify(3)
  })
);

module.exports = config;
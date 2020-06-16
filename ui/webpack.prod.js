const webpack = require('webpack');
const config = require('./webpack.config');

config.mode = 'production';
config.plugins.unshift(
  new webpack.DefinePlugin({
    'process.env.DEBUG_LEVEL': JSON.stringify(0)
  })
);

module.exports = config;
const config = require('./webpack.config');

config.devtool = 'source-map';
config.mode = 'development';

module.exports = config;
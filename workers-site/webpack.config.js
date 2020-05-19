const path = require('path');

module.exports = {
  context: __dirname,
  entry: {
    'index': './src/index.ts',
  },
  /*devtool: 'inline-source-map',*/
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      "@upradio-client": path.resolve(process.cwd(), 'src'),
      "@upradio-server": path.resolve(process.cwd(), 'workers-site/src')
    }
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
};

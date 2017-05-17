'use strict';

const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

function Uglify() {

  return new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    debug: false,
    beautify: false,
    comments: false,
    dead_code: true,
    compress: {
      sequences: true,
      booleans: true,
      loops: true,
      unused: true,
      warnings: false,
      drop_console: false,
      unsafe: true,
      screw_ie8: true,
      dead_code: true
    }
  })

}

function GZip() {

  return new CompressionPlugin({
    asset: "[path].gz[query]",
    algorithm: "gzip",
    test: /\.js$|\.html$/,
    threshold: 10240,
    minRatio: 0.8
  });

}

module.exports = {
  Uglify,
  GZip
};
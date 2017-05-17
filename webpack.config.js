'use strict';

const LOCAL_ENV = 'local';
const DEV_ENV = 'development';
const PROD_ENV = 'production';
const NODE_ENV = process.env.NODE_ENV || DEV_ENV;

const path = require('path');
const webpack = require('webpack');
// const utils = require('./webpack/utils');
const config = require('./webpack/build-config');

module.exports = {

  entry: __dirname + '/src/index.js',

  output: {
    filename: './build/bundle.js',
    library: 'Bundle'
  },

  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
    "react-redux": "ReactRedux",
    "config": JSON.stringify(config)
  },

  watch: NODE_ENV === LOCAL_ENV,
  devtool: NODE_ENV === DEV_ENV ? 'source-map' : false,

  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
      DEV_ENV: JSON.stringify(DEV_ENV)
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [{
          loader: 'babel-loader'
        }],
      },
    ]
  },

  resolve: {
    modules: [
      path.resolve(__dirname, '..', 'src'),
      path.resolve('node_modules')
    ],
    alias: {
      components: path.resolve(__dirname, '../src/components'),
      modules: path.resolve(__dirname, '../src/modules'),
    },
  },

};

// if (NODE_ENV === PROD_ENV) {
//
//   module.exports.plugins.push(utils.Uglify());
//
//   module.exports.plugins.push(utils.GZip());
//
// }

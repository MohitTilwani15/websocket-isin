const path = require('path');
const merge = require('webpack-merge');
const base = require('./base');

module.exports = merge(base, {
  mode: 'development',
  devServer: {
    stats: 'errors-only',
    contentBase: path.join(__dirname, '../dist'),
    compress: true,
    port: 3000,
  },
});

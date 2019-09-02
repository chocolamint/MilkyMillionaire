const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './resources/assets/js/app.js',
  output: {
    path: __dirname + '/public',
    publicPath: '/',
    filename: 'js/app.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'babel-loader'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        use: "ts-loader"
      }
    ]
  },
  resolve: {
    extensions: [".js", ".ts"],
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  }
};
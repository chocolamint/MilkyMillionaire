const webpack = require('webpack');
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  mode: 'development',
  entry: './src/resources/assets/js/app.ts',
  output: {
    path: __dirname + '/src/public',
    publicPath: '/',
    filename: 'js/app.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".ts", '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};
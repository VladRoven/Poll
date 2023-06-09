require('dotenv').config({})

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
const isProd = process.env.NODE_ENV === 'production'
const mode = process.env.NODE_ENV

module.exports = {
  mode,
  entry: path.resolve(__dirname, './src/index.jsx'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: isProd ? '[name].[contenthash].js' : '[name].js',
  },
  resolve: {
    extensions: [
      '.*',
      '.mjs',
      '.js',
      '.jsx',
      '.scss',
      '.png',
      '.jpg',
      '.jpeg',
      '.svg',
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      inject: 'body',
      favicon: './src/assets/images/favicon.ico',
    }),
    new MiniCssExtractPlugin({
      filename: isProd ? '[name].[contenthash].js' : '[name].js',
    }),
    ...(isProd ? [] : [new webpack.HotModuleReplacementPlugin()]),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: {
          loader: 'url-loader?name=app/images/[name].[ext]',
        },
      },
    ],
  },
  devServer: {
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    host: '192.168.0.104',
    port: 3000,
    compress: true,
    historyApiFallback: true,
  },
}

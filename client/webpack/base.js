const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  entry: {
    app: path.join(__dirname, '../src/index.ts'),
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].[chunkHash].js',
    publicPath: '/',
    chunkFilename: '[name].[id].[chunkhash].js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
    runtimeChunk: 'single',
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json', '.node'],
    modules: [
      '../src',
      '../node_modules',
    ],
    alias: {
      vue: 'vue/dist/vue.js'
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        include: [path.join(__dirname, '../src')],
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true,
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.scss$/,
        rules: [
          { loader: 'vue-style-loader' },
          {
            loader: 'css-loader',
            exclude: [/global\.scss/],
            options: {
              modules: true,
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('autoprefixer'),
                require('css-mqpacker')(),
                require('cssnano')({
                  preset: [
                    'default',
                    {
                      discardComments: {
                        removeAll: true,
                      },
                      zindex: false,
                      normalizeWhitespace: true,
                    },
                  ],
                }),
              ],
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(?:jpg|png|svg|ttf|woff2?|eot|ico)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
      {
        test: /\.css$/,
        loader: ['vue-style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HTMLPlugin({ template: path.join(__dirname, '../index.template.html') }),
    new VueLoaderPlugin(),
    new ForkTsCheckerWebpackPlugin({
      tsconfig: path.join(__dirname, '../tsconfig.json'),
      vue: true,
      silent: true,
    }),
  ],
};

import path from 'path';
import { Configuration } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
// import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const config: Configuration = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, "dist/build"),
    filename: "index.js",
    library: 'cypress',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /\.html$/i,
        use: {
          loader: 'html-loader',
          options: {
            minimize: true,
          },
        },
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: "style-loader",
            options: {
              injectType: "lazyStyleTag",
              insert: function (element: HTMLElement, options: any): void {
                (options.target || document.head).appendChild(element);
              },
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)(\?v=\w+)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'src/assets/fonts/[name][ext][query]',
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)(\?v=\w+)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'src/assets/images/[name][ext][query]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/core/styles/exports/', to: '../styles/' },
      ],
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    new ESLintPlugin({
      extensions: ["js", "ts"],
    }),
    // new MiniCssExtractPlugin({
    //   filename: '../styles/index.css'
    // }),
    new CleanWebpackPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({ extractComments: false }),
    ],
  },
};

export default config;

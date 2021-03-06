import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import OfflinePlugin from 'offline-plugin';
import path from 'path';
const ENV = process.env.NODE_ENV || 'development';

const CSS_MAPS = ENV !== 'production';

const BASE_PATH = path.resolve(__dirname, '../')

const gameConfig = require(path.resolve(BASE_PATH, "build/config"))
Object.assign(gameConfig, {
  version: new Date(),
})

console.log(path.resolve(BASE_PATH, "src"))
module.exports = {
  context: path.resolve(BASE_PATH, "src"),
  entry: './index.js',

  output: {
    path: path.resolve(BASE_PATH, "dist"),
    publicPath: '/',
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['.jsx', '.js', '.json', '.scss'],
    modules: [
      path.resolve(BASE_PATH, "src/lib"),
      path.resolve(BASE_PATH, "node_modules"),
      'node_modules'
    ],
    alias: {
      components: path.resolve(BASE_PATH, "src/components"),    // used for tests
      style: path.resolve(BASE_PATH, "src/style"),
      'react': 'preact-compat',
      'react-dom': 'preact-compat',
    }
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: path.resolve(BASE_PATH, 'src'),
        enforce: 'pre',
        use: 'source-map-loader'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        // Transform our own .(scss|css) files with PostCSS and CSS-modules
        test: /\.(scss|css)$/,
        include: [path.resolve(BASE_PATH, 'src')],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { modules: true, sourceMap: CSS_MAPS, importLoaders: 1, minimize: true }
            },
            {
              loader: `postcss-loader`,
              options: {
                sourceMap: CSS_MAPS,
                plugins: () => {
                  autoprefixer({ browsers: ['last 2 versions'] });
                }
              }
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: CSS_MAPS }
            }
          ]
        })
      },
      // {
      //   test: /\.(scss|css)$/,
      //   exclude: [path.resolve(BASE_PATH, 'src/components')],
      //   use: ExtractTextPlugin.extract({
      //     fallback: 'style-loader',
      //     use: [
      //       {
      //         loader: 'css-loader',
      //         options: { sourceMap: CSS_MAPS, importLoaders: 1, minimize: true }
      //       },
      //       {
      //         loader: `postcss-loader`,
      //         options: {
      //           sourceMap: CSS_MAPS,
      //           plugins: () => {
      //             autoprefixer({ browsers: ['last 2 versions'] });
      //           }
      //         }
      //       },
      //       {
      //         loader: 'scss-loader',
      //         options: { sourceMap: CSS_MAPS }
      //       }
      //     ]
      //   })
      // },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.(xml|html|txt|md)$/,
        use: 'raw-loader'
      },
      {
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
        use: ENV === 'production' ? 'file-loader' : 'url-loader'
      }
    ]
  },
  plugins: ([
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin({
      filename: 'style.css',
      allChunks: true,
      disable: ENV !== 'production'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV)
    }),
    new HtmlWebpackPlugin({
      template: './index.ejs',
      minify: { collapseWhitespace: true }
    }),
    new CopyWebpackPlugin([
      { from: './manifest.json', to: './' },
      { from: './favicon.ico', to: './' }
    ]),
    new webpack.BannerPlugin(gameConfig.banner),
    new webpack.DefinePlugin({
      "process.envConfig": JSON.stringify(gameConfig)
    })
  ]).concat(ENV === 'production' ? [
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      compress: {
        unsafe_comps: true,
        properties: true,
        keep_fargs: false,
        pure_getters: true,
        collapse_vars: true,
        unsafe: true,
        warnings: false,
        screw_ie8: true,
        sequences: true,
        dead_code: true,
        drop_debugger: true,
        comparisons: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        if_return: true,
        join_vars: true,
        cascade: true,
        drop_console: true
      }
    }),

    new OfflinePlugin({
      relativePaths: false,
      AppCache: false,
      excludes: ['_redirects'],
      ServiceWorker: {
        events: true
      },
      cacheMaps: [
        {
          match: /.*/,
          to: '/',
          requestTypes: ['navigate']
        }
      ],
      publicPath: '/'
    })
  ] : []),

  stats: { colors: true },

  node: {
    global: true,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false
  },

  devtool: ENV === 'production' ? 'source-map' : 'cheap-module-eval-source-map',

  devServer: {
    port: process.env.PORT || 3000,
    host: 'localhost',
    publicPath: '/',
    contentBase: './src',
    historyApiFallback: true,
    open: true,
    openPage: '',
    proxy: {
      // OPTIONAL: proxy configuration:
      // '/optional-prefix/**': { // path pattern to rewrite
      //   target: 'http://target-host.com',
      //   pathRewrite: path => path.replace(/^\/[^\/]+\//, '')   // strip first path segment
      // }
    }
  }
};

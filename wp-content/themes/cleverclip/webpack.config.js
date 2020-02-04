const path = require("path");
const webpack = require("webpack");

const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const IS_DEVELOPMENT = process.env.NODE_ENV === "dev";

const dirApp = path.join(__dirname, "app");
const dirNode = "node_modules";
const dirStyles = path.join(__dirname, "styles");

const domain = "cleverclip-web.novu.io";
const homedir = require("os").homedir();

module.exports = {
  entry: [path.join(dirApp, "index.js"), path.join(dirStyles, "index.scss")],

  resolve: {
    modules: [dirApp, dirNode]
  },

  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT
    }),

    new webpack.ProvidePlugin({}),

    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })

    /*
    new BrowserSyncPlugin(
      {
        proxy: "https://" + domain,
        host: domain,
        open: "external",
        https: {
          key: homedir + "/.config/valet/Certificates/" + domain + ".key",
          cert: homedir + "/.config/valet/Certificates/" + domain + ".crt"
        }
      },
      {
        reload: false
      }
    )
    */
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env"]]
          }
        }
      },

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: IS_DEVELOPMENT
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: IS_DEVELOPMENT
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: IS_DEVELOPMENT
            }
          }
        ]
      },

      {
        test: /\.(jpe?g|png|gif|svg|woff2?)$/,
        loader: "file-loader",
        options: {
          name(file) {
            if (IS_DEVELOPMENT) {
              return "[path][name].[ext]";
            }

            return "[hash].[ext]";
          }
        }
      },

      {
        test: /\.(glsl|frag|vert)$/,
        loader: "raw-loader",
        exclude: /node_modules/
      },

      {
        test: /\.(glsl|frag|vert)$/,
        loader: "glslify-loader",
        exclude: /node_modules/
      }
    ]
  }
};

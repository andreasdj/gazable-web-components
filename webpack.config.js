
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configuration = (env) => {
  return ({
    mode: env.MODE,
    entry: './src/main.ts',
    devtool: env.MODE === 'development' ? 'inline-source-map' : false,
    devServer: {
        static: {
            directory: path.join(__dirname, "public"),
        },
        compress: true,
        port: 8080,
    },
    optimization: {
        minimize: false,
    },
    experiments: {
        outputModule: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(html)$/,
          use: {
            loader: 'html-loader',
            options: {},
          },
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    resolve: {
      extensions: [ '.ts', '.js' ]
    },
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
      library: {
          type: 'module'
      }
    },
    plugins: [
      new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
        inject: 'head',
        template: 'public/index.html'
        })
    ]
  });
};

export default configuration;

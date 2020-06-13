const webpack = require('webpack');

const devMode = true;

module.exports = {
  mode: devMode ? 'development' : 'production',
  context: __dirname,
  entry: './index.js',
  output: {
    path: __dirname + '/__build__',
    filename: 'bundle.js',
  },
  devServer: {
    historyApiFallback: {
      from: /^\/c\//
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(devMode ? 'development' : 'production')
      }
    })
  ]
};

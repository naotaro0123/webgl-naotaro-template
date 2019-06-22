const path = require('path');

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(frag|vert|glsl)$/,
        use: [
          {
            loader: 'glsl-shader-loader',
            options: {}
          }
        ]
      }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, './src'),
    watchContentBase: true,
    port: 3000,
    open: true,
    openPage: './index.html'
  }
};

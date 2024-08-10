const path = require('path');

module.exports = {
  entry: './src/api.js', // Adjust according to your entry file
  target: 'node',
  externals: {
    '@prisma/client': 'commonjs @prisma/client',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
};

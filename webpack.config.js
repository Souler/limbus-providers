const path = require('path');

module.exports = {
  entry: {
    'limbus-provider-kissanimeac': './src/limbus-provider-kissanimeac/index.ts',
    'limbus-provider-solarmoviezsu': './src/limbus-provider-solarmoviezsu/index.ts',
  },
  mode: 'development',
  devtool: false,
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'ts-loader',
      options: { allowTsInNodeModules: true },
    }],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
};

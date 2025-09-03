const webpack = require('webpack');
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add resolve fallbacks for node.js core modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer/"),
        "path": require.resolve("path-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "fs": false,
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "assert": require.resolve("assert/"),
        "url": require.resolve("url/"),
        "util": require.resolve("util/"),
        "process": require.resolve("process/browser"),
      };

      // Add alias for process/browser
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'process/browser': require.resolve('process/browser'),
      };

      return webpackConfig;
    },
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        }),
      ],
    },
  },
};

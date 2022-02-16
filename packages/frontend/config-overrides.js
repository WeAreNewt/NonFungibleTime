const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    url: require.resolve('url'),
    assert: require.resolve('assert'),
    buffer: require.resolve('buffer'),
    util: require.resolve('util'),
    os: require.resolve('os'),
    https: require.resolve('https-browserify'),
    http: require.resolve('stream-http'),
    stream: require.resolve('stream-browserify')
  };
  config.plugins.push(
    new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
    }),
  );
  return config;
}

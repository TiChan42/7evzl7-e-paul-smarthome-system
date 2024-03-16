const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.entry = './src/index.js';
      return webpackConfig;
    },
  },
};
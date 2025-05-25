const path = require('path');

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://epaul-smarthome.de:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      // Finde die oneOf-Regel, in der Babel drinhängt
      const oneOf = webpackConfig.module.rules.find(r => r.oneOf).oneOf;
      
      // Füge ganz oben eine Ausnahme-Regel für .mjs in @chakra-ui ein
      oneOf.unshift({
        test: /\.mjs$/,
        include: /node_modules[/\\]@chakra-ui/,
        type: "javascript/auto",
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [require.resolve('babel-preset-react-app')],
            plugins: [
              require.resolve('@babel/plugin-proposal-optional-chaining'),
              require.resolve('@babel/plugin-proposal-nullish-coalescing-operator')
            ],
          },
        },
      });
      
      return webpackConfig;
    },
  },
  babel: {
    plugins: [
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator'
    ]
  }
};
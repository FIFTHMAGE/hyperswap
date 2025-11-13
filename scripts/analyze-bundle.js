const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer && process.env.ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: './bundle-report.html',
          openAnalyzer: true,
        })
      );
    }
    return config;
  },
};


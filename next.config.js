const withBundleAnalyzer = require('@next/bundle-analyzer');
const { escape } = require('querystring');
// const { i18n } = require('./next-i18next.config');

const config = {
  output: 'export'
,  // i18n,
  trailingSlash: true,
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(config);

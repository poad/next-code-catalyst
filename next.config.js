const withBundleAnalyzer = require('@next/bundle-analyzer');
// const { i18n } = require('./next-i18next.config');

const config = {
  output: 'export'
,  // i18n,
  trailingSlash: true,
  reactStrictMode: true,
  swcMinify: true,
  productionBrowserSourceMaps: true,
};

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(config);

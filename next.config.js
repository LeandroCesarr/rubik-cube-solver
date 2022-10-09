const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  webpack: (config, { defaultLoaders }) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      include: [path.resolve(__dirname, './src')],
      use: [defaultLoaders.babel],
    });

    return config;
  },
};

module.exports = nextConfig;

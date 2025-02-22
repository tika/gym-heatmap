/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.csv$/,
      loader: 'raw-loader',
      options: {
        esModule: false,
      },
    });
    return config;
  }
};

module.exports = nextConfig;

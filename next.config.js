/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["us-west-2.graphassets.com", "sa-east-1.graphassets.com"],
  },
};

module.exports = nextConfig;

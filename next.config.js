/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "sa-east-1.graphassets.com",
    }],
  },
  allowedDevOrigins: ['192.168.1.7'],
}

module.exports = nextConfig

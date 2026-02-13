/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'arweave.net',
      },
      {
        protocol: 'https',
        hostname: 'www.arweave.net',
      },
    ],
  },
  // Empty turbopack config to silence the warning
  turbopack: {},
}

module.exports = nextConfig
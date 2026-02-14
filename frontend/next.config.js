/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // <-- THIS disables TS errors during build
  },
  reactStrictMode: true,
};

module.exports = nextConfig;

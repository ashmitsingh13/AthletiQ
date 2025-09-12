import nextPWA from 'next-pwa';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
})(nextConfig);

declare module 'next-pwa' {
  import { NextConfig } from 'next';
  type PWAOptions = {
    dest: string;
    register?: boolean;
    skipWaiting?: boolean;
    [key: string]: any;
  };
  function nextPWA(options: PWAOptions): (config: NextConfig) => NextConfig;
  export default nextPWA;
}
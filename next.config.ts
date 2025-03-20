import https from 'https-localhost';
import { NextConfig } from 'next';

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self'; object-src 'none'; connect-src 'self' wss:; upgrade-insecure-requests;",
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Strict-Transport-Security',         // NEW: Enforces HTTPS
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-DNS-Prefetch-Control',            // NEW: Prevents DNS prefetching
    value: 'off',
  },
  {
    key: 'Expect-CT',                         // NEW: Prevents certificate transparency issues
    value: 'max-age=86400, enforce',
  },
];


// Create an async function to handle the HTTPS setup
const getHttpsConfig = async () => {
  const httpsServer = await https();
  return {
    server: {
      https: httpsServer,
      http2: true,  // Enable HTTP/2
    },
  };
};


// Export nextConfig as a Promise for async support
const nextConfig = async (): Promise<NextConfig> => ({
  reactStrictMode: true,
  ...(await getHttpsConfig()),
  images: {
    domains: ['img.youtube.com'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
});

export default nextConfig;

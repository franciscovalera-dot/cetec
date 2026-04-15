/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Permitir imágenes de Sanity CDN
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

export default nextConfig;

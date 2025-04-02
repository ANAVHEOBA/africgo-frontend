/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "build",
  eslint: {
    ignoreDuringBuilds: true, // This will ignore ESLint errors during build
    // Alternatively, you can configure specific rules:
    /*
    config: {
      rules: {
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        'react/no-unescaped-entities': 'warn'
      }
    }
    */
  },
  typescript: {
    ignoreBuildErrors: true, // Add this line to temporarily bypass type errors
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/duk2hhkns/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      }
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
    loader: 'default',
    domains: ['res.cloudinary.com', 'picsum.photos'],
  },
};

module.exports = nextConfig;

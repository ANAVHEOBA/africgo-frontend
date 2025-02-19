/** @type {import('next').NextConfig} */
const nextConfig = {
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
}

module.exports = nextConfig 
/** @type {import('next').NextConfig} */
    const nextConfig = {
      reactStrictMode: true,
      swcMinify: true,
      images: {
        domains: ['localhost'],
      },
      webpack: (config) => {
        config.resolve.fallback = { 
          fs: false, 
          path: false,
          module: false
        }
        return config
      }
    }

    module.exports = nextConfig

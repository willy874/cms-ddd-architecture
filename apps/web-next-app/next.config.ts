import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/apis/:path*',
        destination: `http://localhost:8765/apis/:path*`,
      },
    ]
  },
}

export default nextConfig

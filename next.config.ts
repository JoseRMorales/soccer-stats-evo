import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  sassOptions: {
    silenceDeprecations: ['legacy-js-api']
  },
  output: 'standalone'
}

export default nextConfig

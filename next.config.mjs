/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { hostname: "akmwebstatic.yuanzhanapp.com" },
      { hostname: "akmweb.youngjoygame.com" },
      { hostname: "static.wikia.nocookie.net" },
      { hostname: "indoch.s3.ml.moonlian.com" },
    ],
  },
}

export default nextConfig

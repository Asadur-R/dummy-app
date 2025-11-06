/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  env: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "test",
  },
  experimental: {
    serverComponentsExternalPackages: ["pg"],
  },
};

export default nextConfig;

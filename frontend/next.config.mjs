/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  basePath: isProd ? "/E-learning" : "",
  assetPrefix: isProd ? "/E-learning/" : "",
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
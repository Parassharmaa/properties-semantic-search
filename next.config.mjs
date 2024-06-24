/** @type {import('next').NextConfig} */
const nextConfig = {
  // add iamge host to next/image
  images: {
    domains: ["media.propertyloop.co.uk"],
  },
  experimental: {
    serverComponentsExternalPackages: ["sharp", "onnxruntime-node"],
  },
};

export default nextConfig;

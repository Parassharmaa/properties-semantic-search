/** @type {import('next').NextConfig} */
const nextConfig = {
  // add iamge host to next/image
  images: {
    remotePatterns: [
      {
        hostname: "media.propertyloop.co.uk",
        protocol: "https",
        pathname: "**",
        port: "",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["sharp", "onnxruntime-node"],
  },
};

export default nextConfig;

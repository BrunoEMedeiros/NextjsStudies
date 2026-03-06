import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zenrp.s3.sa-east-1.amazonaws.com",
        port: "",
        pathname: "/**", // optional: restrict to specific paths
      },
      // add more patterns as needed
    ],
  },
};

export default nextConfig;

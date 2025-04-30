import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "opengraph.githubassets.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "services.eu-central-1.v2.cloudbrowser-api.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "iad.microlink.io",
        port: "",
        pathname: "/**",
      },
      // Add other allowed hostnames here if needed
    ],
  },
};

export default nextConfig;

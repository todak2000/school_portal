import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["vip.akwaibomstate.gov.ng"],
  },
  async redirects() {
    return [
      {
        source: "/old-path",
        destination: "/new-path",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

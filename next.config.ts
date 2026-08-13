import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kkheixeqmwwyaqtctkrq.supabase.co",
      },
    ],
  },
};

export default nextConfig;

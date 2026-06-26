import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.101.134'],
  serverExternalPackages: ['mssql'],
};

export default nextConfig;

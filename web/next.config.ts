import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker / Node 服务器部署使用 standalone
  output: "standalone",
  reactCompiler: true,
};

export default nextConfig;


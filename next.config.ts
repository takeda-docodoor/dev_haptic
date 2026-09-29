import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 実機確認用: LAN 内のスマホから dev サーバーの JS を読み込めるようにする
  allowedDevOrigins: ["192.168.0.11"],
};

export default nextConfig;

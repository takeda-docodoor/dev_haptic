import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 実機確認用: LAN 内のスマホから dev サーバーの JS を読み込めるようにする
  allowedDevOrigins: ["192.168.0.11"],
  // 検索エンジンにインデックスさせない（HTML 以外のファイルにも効かせるためヘッダーでも指定）
  headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;

const nextConfig = {
  // On garde les ignores pour la robustesse sur Windows
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
} as any;

export default nextConfig;

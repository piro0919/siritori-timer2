const withPWA = require("next-pwa");
const path = require("path");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA(
  withBundleAnalyzer({
    eslint: {
      ignoreDuringBuilds: true,
    },
    experimental: {
      scrollRestoration: false,
    },
    images: {
      unoptimized: true,
    },
    optimizeFonts: false,
    pwa: {
      dest: "public",
      disable: process.env.NODE_ENV === "development",
    },
    reactStrictMode: false,
    async rewrites() {
      return [
        {
          destination: "/",
          source: "/expert",
        },
        {
          destination: "/",
          has: [
            { type: "query", key: "player" },
            { type: "query", key: "time" },
          ],
          source: "/game",
        },
        {
          destination: "/",
          source: "/party",
        },
      ];
    },
    sassOptions: {
      additionalData: async (content, { resourcePath }) => {
        if (resourcePath.includes("node_modules")) {
          return content;
        }

        if (resourcePath.endsWith("mq-settings.scss")) {
          return process.env.NODE_ENV === "production" ? "" : content;
        }

        return "@use 'styles/mq' as mq;" + content;
      },
      includePaths: [path.join(__dirname, "src/styles")],
    },
    swcMinify: true,
  })
);

module.exports = nextConfig;

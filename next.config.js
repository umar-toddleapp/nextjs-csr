/** @type {import('next').NextConfig} */
const nextConfig = {
  // For development and Vercel deployment (not static export)
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  // Allow iframe embedding
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOWALL",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

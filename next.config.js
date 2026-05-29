/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Open Library cover images to be used with next/image if ever needed.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "covers.openlibrary.org" },
    ],
  },
  // Ensure the editable system prompt file is bundled into the serverless
  // function so it can be read at runtime on Vercel. This is what lets you
  // edit prompts/dogear.md on GitHub mobile and have the change go live.
  outputFileTracingIncludes: {
    "/api/**": ["./prompts/**"],
  },
};

module.exports = nextConfig;

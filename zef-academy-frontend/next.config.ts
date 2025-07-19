import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", 
      },
    ],
  },
};

export default nextConfig;


// next.config.js
// import type { NextConfig } from "next";
// import {withNextVideo} from "next-video/process";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "**", // Wildcard for all hostnames
//       },
//     ],
//   },
//   reactStrictMode: false, // Your existing setting
// };

// // Export the config wrapped with withNextVideo
// export default withNextVideo(nextConfig);
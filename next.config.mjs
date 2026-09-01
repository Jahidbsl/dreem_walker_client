/** @type {import('next').NextConfig} */

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiHostname = new URL(apiUrl).hostname;
const apiProtocol = new URL(apiUrl).protocol.replace(":", "");
const apiPort = new URL(apiUrl).port || undefined;

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: apiProtocol,
        hostname: apiHostname,
        ...(apiPort ? { port: apiPort } : {}),
      },
    ],
  },
};

export default nextConfig;
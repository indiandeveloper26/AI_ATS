/** @type {import('next').NextConfig} */
const nextConfig = {
  // Isse Next.js ko pata chal jayega ki pdf-parse server-only package hai
  serverExternalPackages: ['pdf-parse'],

  // Turbopack ko khali object de kar 'silence' kar dein
  experimental: {
    turbo: {},
  },
};

export default nextConfig;
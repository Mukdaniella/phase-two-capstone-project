import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};
module.exports = {
  images: {
    domains: [
      'your-supabase-project-id.supabase.co', // <- replace with your supabase project's storage domain
      // example: 'abcd1234.supabase.co'
    ],
  },
}
export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'encrypted-tbn0.gstatic.com',
          pathname: '/images**',
        },
        {
          protocol: 'https',
          hostname: 'uglyvegankitchen.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'zhangcatherine.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'www.seasonsandsuppers.ca',
          pathname: '/**',
        },
        {
            protocol: 'https',
            hostname: 'www.simplyrecipes.com',
            pathname: '/**'
        },
      ],
    },
  };
  
  export default nextConfig;


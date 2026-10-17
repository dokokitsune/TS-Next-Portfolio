import 'dotenv/config'



const nextConfig = {
  async redirects() {
    return [
      { source: '/aboutMe', destination: '/#about', permanent: true },
      { source: '/projects', destination: '/#projects', permanent: true },
      { source: '/contactMe', destination: '/#contact', permanent: true },
    ];
  },
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.akamai.steamstatic.com',
				pathname: '/steamcommunity/public/images/apps/**',
			},
			{
				protocol: 'https',
				hostname: 'shared.akamai.steamstatic.com',
				pathname: '/community_assets/images/apps/**',
			},
			{
				protocol: 'https',
				hostname: 'steamcdn-a.akamaihd.net',
				port: '',
				pathname: '/steam/apps/**',
			},
      {
        protocol: 'https',
        hostname: 'shared.fastly.steamstatic.com',
        port: '',
        pathname: '/store_item_assets/steam/apps/**'
      },
      {
        protocol: 'https',
        hostname: 'shared.fastly.steamstatic.com',
        pathname: '/community_assets/images/apps/**'
      },
			{
				protocol: 'https',
				hostname: 'steamcdn-a.akamaihd.net',
				port: '',
				pathname: '/steamcommunity/public/images/apps/**',
			},
		],
	},
};

export default nextConfig;


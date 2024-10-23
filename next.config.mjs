import 'dotenv/config'



const nextConfig = {
	output: "standalone",
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'steamcdn-a.akamaihd.net',
				port: '',
				pathname: '/steam/apps/**',
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


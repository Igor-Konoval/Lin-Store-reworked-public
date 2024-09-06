/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '5500',
				// pathname: '/',
			},
			{
				protocol: 'https',
				hostname: 'storage.googleapis.com',
				// pathname: '/',
			},
		],
	},
}

export default nextConfig

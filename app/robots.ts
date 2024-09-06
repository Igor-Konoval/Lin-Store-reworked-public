import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: '*',
				disallow: [
					'/admin',
					'/basket',
					'/comments-list',
					'/order',
					'/saved-products',
				],
			},
		],
		sitemap: process.env.NEXTAUTH_URL + '/sitemap.xml',
	}
}

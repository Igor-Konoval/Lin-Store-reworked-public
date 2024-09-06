import { fetchFilters } from '@/services/filterAPI'
import { IFilter } from '@/types/IFilter'
import { IProduct } from '@/types/IProduct'
import { MetadataRoute } from 'next'

async function generateSiteMapProductsId(): Promise<MetadataRoute.Sitemap> {
	const getFilters = await fetchFilters()

	const reTypes: string[] = getFilters.types.map((type: IFilter) => type.name)
	const reBrands: string[] = getFilters.brands.map(
		(brand: IFilter) => brand.name
	)

	const typeBrandPaths: string[] = []

	for (let i = 0; i < reBrands.length; i++) {
		typeBrandPaths.push(
			...reTypes.map(type => `p=1/brand=${reBrands[i]}/type=${type}`)
		)
	}
	const brandPaths: string[] = reBrands.map(
		(brand: string) => `p=1/brand=${brand}`
	)

	const typePaths: string[] = reTypes.map((type: string) => `p=1/type=${type}`)

	return [...typeBrandPaths, ...brandPaths, ...typePaths].map(path => ({
		url: process.env.NEXTAUTH_URL! + '/products/' + path,
		lastModified: new Date(),
	}))
}

async function generateSiteMapProductId(): Promise<MetadataRoute.Sitemap> {
	const products: IProduct[] = await fetch(
		process.env.NEXT_PUBLIC_API_URL + 'product'
	)
		.then(response => response.json())
		.then(response => response.productList)

	return products.map(product => ({
		url: process.env.NEXTAUTH_URL + '/product/' + product.name,
		lastModified: new Date(),
	}))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	return [
		{
			url: process.env.NEXTAUTH_URL!,
			lastModified: new Date(),
		},
		{
			url: process.env.NEXTAUTH_URL! + '/policy',
			lastModified: new Date(),
		},
		...(await generateSiteMapProductsId()),
		...(await generateSiteMapProductId()),
	]
}

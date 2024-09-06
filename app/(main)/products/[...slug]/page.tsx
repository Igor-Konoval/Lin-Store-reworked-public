import ProductList from '@/components/ProductList'
import { fetchFilters } from '@/services/filterAPI'
import { IFilter } from '@/types/IFilter'
import { pathSegments } from '@/utils/serviceUtils'
import { Metadata } from 'next'

export async function generateStaticParams() {
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
		slug: path.split('/'),
	}))
}

export async function generateMetadata({
	params,
}: {
	params: { slug: string[] }
}): Promise<Metadata> {
	const { isValidBrand, isValidType } = pathSegments(
		params.slug.map(value => decodeURIComponent(value))
	)
	const urlOG = params.slug
		.map(value => decodeURIComponent(value))
		.reduce((prev, current) => prev + '/' + current)

	const result = {
		title: '',
		description: '',
		openGraph: {
			title: '',
			siteName: 'Lin-Store',
			locale: 'uk_UA',
			url: process.env.NEXTAUTH_URL + '/products/' + urlOG, //перевірити потім
			type: 'website',
		},
	} as Metadata

	if (isValidType !== undefined && isValidBrand !== undefined) {
		result.title = `Купити ${isValidType} ${isValidBrand}`
		result.description = `Широкий вибір на ${isValidType} від бренду ${isValidBrand}. Купуйте вигідно у Lin-Store.`
	}

	if (isValidType === undefined && isValidBrand !== undefined) {
		result.title = `Купити товари ${isValidBrand} в Lin-Store - Відмінні пропозиції за вигідною ціною!`
		result.description = `Широкий вибір товарів від бренду ${isValidBrand}. Купуйте вигідно у Lin-Store.`
	}

	if (isValidType !== undefined && isValidBrand === undefined) {
		result.title = `Придбати ${isValidType} в Lin-Store - Відмінні пропозиції за вигідною ціною!`
		result.description = `Широкий вибір на ${isValidType}. Купуйте вигідно у Lin-Store.`
	}

	result.openGraph!.title = result.title!
	result.openGraph!.description = result.description!

	return result
}

export default async function Page({ params }: { params: { slug: string[] } }) {
	const path: string[] = params.slug

	const validPath: string = path.reduce(
		(prev, value) => decodeURIComponent(value) + '&' + decodeURIComponent(prev)
	)
	const data = await fetch(
		process.env.NEXT_PUBLIC_API_URL +
			`product?searchTerm=&limit=25&${validPath}`,
		{
			next: { revalidate: 100 },
		}
	).then(value => value.json())
	return <ProductList products={data} />
}

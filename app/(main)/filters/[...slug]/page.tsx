import FilterContainer from '@/components/FilterContainer'
import { pathSegments } from '@/utils/serviceUtils'
import { Metadata } from 'next'

export async function generateMetadata({
	params,
}: {
	params: { slug: string[] }
}): Promise<Metadata> {
	const { isValidBrand, isValidType, isValidSearch } = pathSegments(
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
			url: process.env.NEXTAUTH_URL + '/filters/' + urlOG,
			type: 'website',
		},
	} as Metadata

	if (
		isValidType !== undefined &&
		isValidBrand !== undefined &&
		isValidSearch === undefined
	) {
		result.title = `Купити ${isValidType} ${isValidBrand}`
		result.description = `Широкий вибір на ${isValidType} від бренду ${isValidBrand}. Купуйте вигідно у Lin-Store.`
	}

	if (
		isValidType === undefined &&
		isValidBrand !== undefined &&
		isValidSearch === undefined
	) {
		result.title = `Купити товари ${isValidBrand} в Lin-Store - Відмінні пропозиції за вигідною ціною!`
		result.description = `Широкий вибір товарів від бренду ${isValidBrand}. Купуйте вигідно у Lin-Store.`
	}

	if (
		isValidType !== undefined &&
		isValidBrand === undefined &&
		isValidSearch === undefined
	) {
		result.title = `Придбати ${isValidType} в Lin-Store - Відмінні пропозиції за вигідною ціною!`
		result.description = `Широкий вибір на ${isValidType}. Купуйте вигідно у Lin-Store.`
	}

	if (
		isValidType !== undefined &&
		isValidBrand !== undefined &&
		isValidSearch !== undefined
	) {
		result.title = `Купити ${isValidType} ${isValidBrand} ${isValidSearch}`
		result.description = `Широкий вибір на ${isValidType} ${isValidSearch} від бренду ${isValidBrand}. Купуйте вигідно у Lin-Store.`
	}

	if (
		isValidType === undefined &&
		isValidBrand !== undefined &&
		isValidSearch !== undefined
	) {
		result.title = `Купити товари ${isValidBrand} ${isValidSearch} в Lin-Store - Відмінні пропозиції за вигідною ціною!`
		result.description = `Купуй ${isValidSearch} від бренду ${isValidBrand}. Купуйте вигідно у Lin-Store.`
	}

	if (
		isValidType !== undefined &&
		isValidBrand === undefined &&
		isValidSearch !== undefined
	) {
		result.title = `Придбати ${isValidType} ${isValidSearch} в Lin-Store - Відмінні пропозиції за вигідною ціною!`
		result.description = `Широкий вибір на ${isValidType} ${isValidSearch}. Купуйте вигідно у Lin-Store.`
	}

	if (
		isValidType === undefined &&
		isValidBrand === undefined &&
		isValidSearch !== undefined
	) {
		result.title = `Придбати ${isValidSearch} в Lin-Store - Відмінні пропозиції за вигідною ціною!`
		result.description = `Придбати товар ${isValidSearch}. Купуйте вигідно у Lin-Store.`
	}

	result.openGraph!.title = result.title!
	result.openGraph!.description = result.description!

	return result
}

export default function Page({ params }: { params: { slug: string[] } }) {
	return <FilterContainer />
}

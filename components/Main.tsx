import { IProductList } from '@/types/IProduct'
import ProductList from './ProductList'

async function fetchMainProducts(): Promise<IProductList> {
	const data = await fetch(
		process.env.NEXT_PUBLIC_API_URL + 'product?searchTerm=&page=1&limit=25',
		{
			next: { revalidate: 100 },
		}
	).then(value => value.json())
	return data
}

export default async function Main() {
	const products = await fetchMainProducts()
	return <ProductList products={products} />
}

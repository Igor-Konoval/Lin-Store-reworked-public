'use client'
import { usePathname } from 'next/navigation'
import ProductList from './ProductList'
import { useEffect, useState } from 'react'
import { IProductList } from '@/types/IProduct'
import LoadSpinner from './LoadSpinner'

export default function FilterContainer() {
	const [products, setProducts] = useState<IProductList>()

	const params = usePathname()
	const path: string[] = params.split('/')

	const validPath: string = path.reduce(
		(prev, value) => decodeURIComponent(value) + '&' + decodeURIComponent(prev)
	)

	useEffect(() => {
		;(async () => {
			await fetch(process.env.NEXT_PUBLIC_API_URL + `product?limit=25&${validPath}`, {next: {revalidate: 120}}) 
				.then(value => value.json())
				.then(data => setProducts(data))
		})()
	}, [params])
	if (!products) {
		return <LoadSpinner />
	}
	return <ProductList products={products} />
}

'use client'
import '@/styles/ProductList.css'
import { IProductList } from '@/types/IProduct'
import { pathSegments } from '@/utils/serviceUtils'
import { usePathname } from 'next/navigation'
import { FC, useEffect } from 'react'
import { Row } from 'react-bootstrap'
import { useBrandContext } from '../contexts/BrandContext/BrandContextProvider'
import { usePageContext } from '../contexts/PageContext/PageContextProvider'
import { usePriceContext } from '../contexts/PriceContext/PriceContextProvider'
import { useSearchContext } from '../contexts/SearchContext/SearchContextProvider'
import { useSortContext } from '../contexts/SortContext/SortContextProvider'
import { useTypeContext } from '../contexts/TypeContext/TypeContextProvider'
import InitPrice from './InitPrice'
import Product from './Product'

const ProductList: FC<{ products: IProductList }> = ({ products }) => {
	const params = usePathname()
	const path: string[] = params.split('/')

	const { sortPrice, setSortPrice } = useSortContext()
	const { type, setType } = useTypeContext()
	const { brand, setBrand } = useBrandContext()
	const { price, setPrice } = usePriceContext()
	const { pages, setPages } = usePageContext()
	const { search, setFilterSearch } = useSearchContext()

	useEffect(() => {
		const validSegments = pathSegments(path)

		if (validSegments.isValidSearch !== undefined) {
			if (search !== validSegments.isValidSearch) {
				setFilterSearch(validSegments.isValidSearch)
			}
		} else if (search !== '' && validSegments.isValidSearch === undefined) {
			setFilterSearch('')
		}
		if (validSegments.isValidType !== undefined) {
			if (validSegments.isValidType !== type.name) {
				setType({ _id: '', name: validSegments.isValidType })
			}
		} else if (type._id !== null) {
			setType({
				name: 'Категории',
				_id: null,
			})
		}
		if (validSegments.isValidBrand !== undefined) {
			if (validSegments.isValidBrand !== brand.name) {
				setBrand({ _id: '', name: validSegments.isValidBrand })
			}
		} else if (brand._id !== null) {
			setBrand({
				name: 'Бренды',
				_id: null,
			})
		}
		if (
			validSegments.isValidMinPrice !== undefined &&
			validSegments.isValidMaxPrice !== undefined
		) {
			setPrice({
				fixedPrices: { ...price.fixedPrices },
				prices: {
					minPrice: +validSegments.isValidMinPrice,
					maxPrice: +validSegments.isValidMaxPrice,
				},
			})
		} else if (
			validSegments.isValidMinPrice === undefined &&
			validSegments.isValidMaxPrice !== undefined
		) {
			setPrice({
				fixedPrices: { ...price.fixedPrices },
				prices: {
					minPrice: price.prices.minPrice,
					maxPrice: +validSegments.isValidMaxPrice,
				},
			})
		} else if (
			validSegments.isValidMinPrice !== undefined &&
			validSegments.isValidMaxPrice === undefined
		) {
			setPrice({
				fixedPrices: { ...price.fixedPrices },
				prices: {
					minPrice: +validSegments.isValidMinPrice,
					maxPrice: price.prices.maxPrice,
				},
			})
		}
		if (validSegments.isValidSortPrice !== undefined) {
			if (validSegments.isValidSortPrice !== sortPrice) {
				setSortPrice(validSegments.isValidSortPrice)
			}
		} else if (sortPrice !== null) {
			setSortPrice(null)
		}
		if (
			products.currentPage !== undefined &&
			products.currentPage <= pages.totalPages &&
			products.currentPage > 0
		) {
			setPages({
				totalPages: pages.totalPages,
				currentPage:
					products.currentPage !== undefined ? products.currentPage : 1,
			})
		}
		if (
			products.totalPages !== undefined &&
			products.totalPages !== pages.totalPages &&
			products.totalPages > 0
		) {
			setPages({
				totalPages: products.totalPages !== undefined ? products.totalPages : 1,
				currentPage:
					products.currentPage !== undefined ? products.currentPage : 1,
			})
		}
	}, [products, params])

	return (
		<>
			<Row className='productList-container d-flex flex-wrap m-auto mt-3'>
				{products.productList.map(product => (
					<Product key={product._id} product={product} />
				))}
			</Row>
			<InitPrice allPrices={products.allPrices} />
		</>
	)
}

export default ProductList

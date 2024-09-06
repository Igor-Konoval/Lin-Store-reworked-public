'use client'
import { useRouter } from 'next/navigation'
import { FC, useMemo } from 'react'
import { Pagination } from 'react-bootstrap'
import { useBrandContext } from '../contexts/BrandContext/BrandContextProvider'
import { usePageContext } from '../contexts/PageContext/PageContextProvider'
import { usePriceContext } from '../contexts/PriceContext/PriceContextProvider'
import { useSearchContext } from '../contexts/SearchContext/SearchContextProvider'
import { useSortContext } from '../contexts/SortContext/SortContextProvider'
import { useTypeContext } from '../contexts/TypeContext/TypeContextProvider'

const PageBar: FC = () => {
	const router = useRouter()

	const { search } = useSearchContext()
	const { sortPrice: selectSortPrice } = useSortContext()
	const { type: selectedType } = useTypeContext()
	const { brand: selectedBrand } = useBrandContext()
	const { price } = usePriceContext()
	const {
		pages: { currentPage, totalPages },
	} = usePageContext()

	const pages = useMemo(() => {
		const calculatedPages = []
		for (let i = 0; i < totalPages; i++) {
			calculatedPages.push(1 + i)
		}
		return calculatedPages
	}, [totalPages])

	return (
		<div className='d-flex justify-content-center align-content-center'>
			<Pagination className='mt-5'>
				<Pagination.First
					onClick={() => {
						if (currentPage === 1) {
							return false
						}
						if (
							price.prices.minPrice === price.fixedPrices.minPrice &&
							price.prices.maxPrice === price.fixedPrices.maxPrice &&
							selectSortPrice === null
						) {
							router.push(
								process.env.NEXTAUTH_URL +
									`/products/p=1${
										selectedBrand._id !== null
											? '/brand=' + selectedBrand.name
											: ''
									}${
										selectedType._id !== null
											? '/type=' + selectedType.name
											: ''
									}
									`
							)
						} else {
							router.push(
								process.env.NEXTAUTH_URL +
									`/filters/p=1${search !== '' ? '/search=' + search : ''}${
										selectedBrand._id !== null
											? '/brand=' + selectedBrand.name
											: ''
									}${
										selectedType._id !== null
											? '/type=' + selectedType.name
											: ''
									}
								${selectSortPrice !== null ? '/sortPrice=' + selectSortPrice : ''}
									${
										price.prices.minPrice !== price.fixedPrices.minPrice
											? '/minPrice=' + price.prices.minPrice
											: ''
									}
									${
										price.prices.maxPrice !== price.fixedPrices.maxPrice
											? '/maxPrice=' + price.prices.maxPrice
											: ''
									}
								`
							)
						}
					}}
				/>
				{pages.map(value => (
					<Pagination.Item
						onClick={e => {
							if (currentPage === value) {
								return false
							}
							if (
								price.prices.minPrice === price.fixedPrices.minPrice &&
								price.prices.maxPrice === price.fixedPrices.maxPrice &&
								selectSortPrice === null
							) {
								router.push(
									process.env.NEXTAUTH_URL +
										`/products/p=${value}${
											selectedBrand._id !== null
												? '/brand=' + selectedBrand.name
												: ''
										}${
											selectedType._id !== null
												? '/type=' + selectedType.name
												: ''
										}
										`
								)
							} else {
								router.push(
									process.env.NEXTAUTH_URL +
										`/filters/p=${value}${
											search !== '' ? '/search=' + search : ''
										}${
											selectedBrand._id !== null
												? '/brand=' + selectedBrand.name
												: ''
										}${
											selectedType._id !== null
												? '/type=' + selectedType.name
												: ''
										}
									${selectSortPrice !== null ? '/sortPrice=' + selectSortPrice : ''}
										${
											price.prices.minPrice !== price.fixedPrices.minPrice
												? '/minPrice=' + price.prices.minPrice
												: ''
										}
										${
											price.prices.maxPrice !== price.fixedPrices.maxPrice
												? '/maxPrice=' + price.prices.maxPrice
												: ''
										}
									`,
									{ scroll: true }
								)
							}
						}}
						active={currentPage === value}
						key={value}
					>
						{value}
					</Pagination.Item>
				))}
				<Pagination.Last
					onClick={() => {
						if (currentPage === totalPages) {
							return false
						}
						if (
							price.prices.minPrice === price.fixedPrices.minPrice &&
							price.prices.maxPrice === price.fixedPrices.maxPrice &&
							selectSortPrice === null
						) {
							router.push(
								process.env.NEXTAUTH_URL +
									`/products/p=${totalPages}${
										selectedBrand._id !== null
											? '/brand=' + selectedBrand.name
											: ''
									}${
										selectedType._id !== null
											? '/type=' + selectedType.name
											: ''
									}
									`
							)
						} else {
							router.push(
								process.env.NEXTAUTH_URL +
									`/filters/p=${totalPages}${
										search !== '' ? '/search=' + search : ''
									}${
										selectedBrand._id !== null
											? '/brand=' + selectedBrand.name
											: ''
									}${
										selectedType._id !== null
											? '/type=' + selectedType.name
											: ''
									}
								${selectSortPrice !== null ? '/sortPrice=' + selectSortPrice : ''}
									${
										price.prices.minPrice !== price.fixedPrices.minPrice
											? '/minPrice=' + price.prices.minPrice
											: ''
									}
									${
										price.prices.maxPrice !== price.fixedPrices.maxPrice
											? '/maxPrice=' + price.prices.maxPrice
											: ''
									}
								`
							)
						}
					}}
				/>
			</Pagination>
		</div>
	)
}

export default PageBar

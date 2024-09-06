'use client'
import '@/styles/FilterComponent.css'
import { IFilter } from '@/types/IFilter'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useMemo, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { useBrandContext } from '../contexts/BrandContext/BrandContextProvider'
import { usePriceContext } from '../contexts/PriceContext/PriceContextProvider'
import { useSearchContext } from '../contexts/SearchContext/SearchContextProvider'
import { useSortContext } from '../contexts/SortContext/SortContextProvider'
import { useTypeContext } from '../contexts/TypeContext/TypeContextProvider'
import DropdownPrice from './DropdownPrice'
import FilterItem from './FilterItem'
import SortPrice from './SortPrice'

const FilterComponent: FC<{
	brands: IFilter[]
	types: IFilter[]
}> = ({ brands: brandsFilter, types: typesFilter }) => {
	const router = useRouter()

	const { search } = useSearchContext()
	const { sortPrice: currentSortPrice, setSortPrice } = useSortContext()
	const { type: contextType, setType } = useTypeContext()
	const { brand: contextBrand, setBrand } = useBrandContext()
	const { price: selectorPrices, setPrice } = usePriceContext()

	const [selectMinPrice, setSelectMinPrice] = useState<number>(
		selectorPrices.prices.minPrice
	)
	const [selectMaxPrice, setSelectMaxPrice] = useState<number>(
		selectorPrices.prices.maxPrice
	)
	const [toggleFilterBar, setToggleFilterBar] = useState<boolean>(false)

	const [selectedSortPrice, setSelectedSortPrice] = useState<string | null>(
		null
	)

	const [selectType, setSelectType] = useState<IFilter>(contextType)
	const [selectBrand, setSelectBrand] = useState<IFilter>(contextBrand)

	useEffect(() => {
		if (!Object.is(contextType, selectType)) {
			setSelectType(contextType)
		}
	}, [contextType])

	useEffect(() => {
		if (!Object.is(contextBrand, selectBrand)) {
			setSelectBrand(contextBrand)
		}
	}, [contextBrand])

	useEffect(() => {
		setSelectMinPrice(selectorPrices.prices.minPrice)
		setSelectMaxPrice(selectorPrices.prices.maxPrice)
	}, [selectorPrices])

	useEffect(() => {
		setSelectedSortPrice(currentSortPrice)
	}, [currentSortPrice])

	const handlerToggleFilterBar = () => {
		setToggleFilterBar((prevState: boolean) => !prevState)
	}

	const handlerOnClick = () => {
		setToggleFilterBar(false)
		setBrand(selectBrand)
		setType(selectType)
		setSortPrice(selectedSortPrice)
		if (
			selectMinPrice === selectorPrices?.fixedPrices.minPrice &&
			selectMaxPrice === selectorPrices?.fixedPrices.maxPrice &&
			selectedSortPrice === null
		) {
			router.push(
				`/products/p=1${
					selectBrand._id !== null ? '/brand=' + selectBrand.name : ''
				}${selectType._id !== null ? '/type=' + selectType.name : ''}
					`
			)
		} else {
			router.push(
				`/filters/p=1${search !== '' ? '/search=' + search : ''}${
					selectBrand._id !== null ? '/brand=' + selectBrand.name : ''
				}${selectType._id !== null ? '/type=' + selectType.name : ''}
				${selectedSortPrice !== null ? '/sortPrice=' + selectedSortPrice : ''}
					${
						selectMinPrice !== selectorPrices?.fixedPrices.minPrice
							? '/minPrice=' + selectMinPrice
							: ''
					}
					${
						selectMaxPrice !== selectorPrices?.fixedPrices.maxPrice
							? '/maxPrice=' + selectMaxPrice
							: ''
					}
					`
			)
		}
	}

	const handlerRangeSelect = (
		selectMinPrice: number,
		selectMaxPrice: number
	) => {
		setSelectMinPrice(+selectMinPrice)
		setSelectMaxPrice(+selectMaxPrice)
	}

	const handlerOnReset = async () => {
		router.push('/')
	}

	const handlerOnRemoveSortPrice = () => {
		if (currentSortPrice == selectedSortPrice) {
			setSortPrice(null)
		} else {
			setSelectedSortPrice(null)
		}
	}

	const handlerOnRemovePrices = () => {
		setPrice({
			...selectorPrices,
			prices: {
				minPrice: selectorPrices?.fixedPrices.minPrice,
				maxPrice: selectorPrices?.fixedPrices.maxPrice,
			},
		})
	}

	const handlerSortPrice = (value: string) => {
		setSelectedSortPrice(value)
	}

	const handlerTypeSelect = (selectedType: IFilter) => {
		setSelectType(selectedType)
	}

	const handlerBrandSelect = (selectedBrand: IFilter) => {
		setSelectBrand(selectedBrand)
	}

	const handlerOnRemoveBrand = () => {
		if (selectBrand.name == contextBrand.name) {
			setBrand({ name: 'Бренды', _id: null })
		}
		setSelectBrand({ name: 'Бренды', _id: null })
	}

	const handlerOnRemoveType = () => {
		if (selectType.name == contextType?.name) {
			setType({ name: 'Категории', _id: null })
		}
		setSelectType({ name: 'Категории', _id: null })
	}

	const memoFilterType = useMemo(
		() => (
			<FilterItem
				title={'Категорія'}
				typeFilter={typesFilter}
				onSelect={handlerTypeSelect}
				selectValue={selectType}
				removeValue={handlerOnRemoveType}
			/>
		),
		[typesFilter, selectType]
	)

	const memoFilterBrand = useMemo(
		() => (
			<FilterItem
				title={'Бренди'}
				typeFilter={brandsFilter}
				onSelect={handlerBrandSelect}
				selectValue={selectBrand}
				removeValue={handlerOnRemoveBrand}
			/>
		),
		[brandsFilter, selectBrand]
	)

	const memoPrices = useMemo(
		() => (
			<DropdownPrice
				minPrice={selectMinPrice}
				maxPrice={selectMaxPrice}
				onPriceChange={handlerRangeSelect}
				removeValue={handlerOnRemovePrices}
			/>
		),
		[selectMinPrice, selectMaxPrice, selectorPrices]
	)

	const memoSortPrice = useMemo(
		() => (
			<SortPrice
				changeSortPrice={handlerSortPrice}
				selectSortPrice={selectedSortPrice}
				removeSortPrice={handlerOnRemoveSortPrice}
			/>
		),
		[selectedSortPrice]
	)

	return (
		<section>
			<Row className='container-adaptive-filterBar p-0'>
				<Col sm={5} xs={7} className='px-0 controllers-adaptive-filterBar'>
					<Button
						className='btn-toggle-filterBar d-flex flex-nowrap align-items-center'
						variant='outline-secondary'
						size={'sm'}
						onClick={() => handlerToggleFilterBar()}
					>
						Показати фільтр
						<Image
							className={`mx-1 btn-toggle-img ${
								toggleFilterBar ? '' : 'btn-toggle-img-hide'
							}`}
							width={14}
							height={19}
							alt='down_arrow'
							src={
								process.env.NEXT_PUBLIC_API_URL +
								'down-filled-triangular-arrow.png'
							}
						/>
					</Button>
					<Button
						onClick={handlerOnReset}
						className='btn-filter-clear-inBar'
						size={'sm'}
						variant='outline-secondary'
					>
						Очистити
					</Button>
				</Col>
				<Col sm={7} xs={12} className='container-selectFilters'>
					{selectedSortPrice && <span>{selectedSortPrice}</span>}
					{selectBrand._id && <span>{selectBrand.name}</span>}
					{selectType._id && <span>{selectType.name}</span>}
					{selectMaxPrice !== null && selectMinPrice !== null ? (
						selectMinPrice !== selectorPrices.fixedPrices.minPrice ||
						selectMaxPrice !== selectorPrices.fixedPrices.maxPrice ? (
							<span>
								{selectMinPrice + ' грн - ' + selectMaxPrice + ' грн'}
							</span>
						) : (
							''
						)
					) : (
						''
					)}
				</Col>
			</Row>
			<Row className={`container-filterBar ${toggleFilterBar ? ' open' : ''}`}>
				{memoFilterType}
				{memoSortPrice}
				{memoFilterBrand}
				{memoPrices}
				<Col className='d-flex align-items-center'>
					<Button
						onClick={handlerOnClick}
						className='btn-filter-apply'
						variant='outline-success'
					>
						Знайти
					</Button>
					<Button
						onClick={handlerOnReset}
						className='btn-filter-clear'
						variant='outline-success'
					>
						Очистити
					</Button>
				</Col>
			</Row>
		</section>
	)
}

export default FilterComponent

import { IColor } from '@/types/IColor'

export interface IProduct {
	_id: string
	name: string
	shortDescription: string
	totalRating: number
	countRating: number
	countSales: number
	count: number
	img: string[]
	price: number
	wasInUsed: boolean
	isActive: boolean
	colors: IColor[]
}

export interface ISelectedProduct extends Omit<IProduct, 'img'> {
	description: IDescription[]
	typeId: string
	brandId: string
	selectedColor?: string
	commentId: string
	img: string[]
}

export interface IBasketProduct extends IProduct {
	commentId: string
	typeId: string
	brandId: string
	totalProducts: number | null
}

export interface IDescription {
	title: string
	description: string
	_id: string
}

export interface IProductList {
	currentPage?: number
	totalPages?: number
	productList: IProduct[]
	allPrices: allPrices
}

export interface Prices {
	minPrice: number
	maxPrice: number
}

export interface allPrices {
	prices: Prices
	fixedPrices: Prices
}

export interface IRangeProps extends Prices {
	onPriceChange: (min: number, max: number) => void
	onWidthChange: (width: number) => void
}

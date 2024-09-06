import { IBasketProduct, ISelectedProduct } from '@/types/IProduct'

export interface ISelectCount {
	selectedCount: number
	selectedColor: string
	selectedImg: string
	name: string
	img: string[]
	isActive: boolean
	_id: string
	countProduct: number
	countedPrice: number
	price: number
}

export interface IBasket {
	products: IBasketProduct[]
	error?: string
	isLoading?: boolean
}

export interface IGetBasket extends ISelectedProduct {
	selectedColor: string
	selectedImg: string
}

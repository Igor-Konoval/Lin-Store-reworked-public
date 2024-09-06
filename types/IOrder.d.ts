import { ISelectedProduct } from './IProduct'

export interface ICheckOrderProduct {
	isGetProduct: boolean
	isSetRating: boolean
}

export interface IOrder {
	_id: string
	products: ISelectedProduct[]
	TTN: number
	isCancel: boolean
	price: number
	info: string[]
	status: string[]
	orderNumber: number
	receivedL: boolean
	resultStatus: {
		deliveryCost: number
		deliveryData: string
		warehouseRecipient: string
	}
	typeDelivery: string
	userId: string
}

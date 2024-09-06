import { ISelectCount } from '@/types/IBasket'

export interface ICheckDetails {
	costInfo: {
		AssessedCost: number
		Cost: number
	}
	deliveryInfo: {
		date: string
		timezone: string
		timezone_type: number
	}
}

export interface IModalPostalComponent {
	onClickHandler: () => {}
	totalPrice: number
	reProductList: () => ISelectCount[]
	show: boolean
	onHide: () => void
}

export interface ISelectCity {
	present: string
	ref: string
}

export interface ISelectStreet {
	street: string
	ref: string
}

export interface IIdentifyDepartment {
	description: string
	ref: string
	warehouseIndex: string
}

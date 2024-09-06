import { MutableRefObject } from 'react'

export interface IErrorMessage {
	errorTitle: string
	errorData: string
}

export interface IStatusCode {
	statusCode: number
}

export interface IAlertDismissible {
	showAlertDis: boolean
	setShowAlertDis: (value: boolean) => {}
	errorMessage: IErrorMessage
}

export interface IAlertBasket {
	message: string
	show: boolean
	target: MutableRefObject<HTMLElement | any>
}

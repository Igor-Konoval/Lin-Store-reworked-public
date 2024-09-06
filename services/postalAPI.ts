import axios from 'axios'
import { ICheckDetails, IIdentifyDepartment } from '@/types/IPostalModal'
import { ICheckOrderProduct } from '@/types/IOrder'
import { configHeaders } from '@/utils/authUtils'

export const formatDate = (userBirthdate: string | Date) => {
	const dateFormat = new Date(userBirthdate)

	const months: string[] = [
		'січня',
		'лютого',
		'березня',
		'квітня',
		'травня',
		'червня',
		'липня',
		'серпня',
		'вересня',
		'жовтня',
		'листопада',
		'грудня',
	]

	const day: number = dateFormat.getDate()
	const monthIndex: number = dateFormat.getMonth()
	const year: number = dateFormat.getFullYear()

	const formattedDate: string = `${day} ${months[monthIndex]} ${year} року`

	return formattedDate
}

export const getOrderUser = async () => {
	const { data } = await axios.get(
		process.env.NEXT_PUBLIC_API_URL + 'order/orderUser',
		await configHeaders()
	)
	return data
}

export const identifyCity = async (city: string) => {
	try {
		const { data } = await axios.post(
			process.env.NEXT_PUBLIC_API_URL + 'order/identifyCity',
			{
				city,
			},
			await configHeaders()
		)
		return data
	} catch (e: any) {
		console.log({ message: e.message })
	}
}

export const cancelOrder = async (TTN: number, orderNumber: number) => {
	try {
		const { data } = await axios.put(
			process.env.NEXT_PUBLIC_API_URL + 'order/cancelOrder',
			{
				TTN,
				orderNumber,
			},
			await configHeaders()
		)
		return data
	} catch (e: any) {
		console.log({ message: e.message })
	}
}

export const getStreet = async (cityRef: string, street: string) => {
	try {
		const { data } = await axios.post(
			process.env.NEXT_PUBLIC_API_URL + 'order/getStreet',
			{
				cityRef,
				street,
			},
			await configHeaders()
		)
		return data
	} catch (e: any) {
		console.log({ message: e.message })
	}
}

export const identifyDepartment = async (cityRef: string) => {
	try {
		const { data }: { data: IIdentifyDepartment[] } = await axios.post(
			process.env.NEXT_PUBLIC_API_URL + 'order/identifyDepartment',
			{
				cityRef,
			},
			await configHeaders()
		)
		return data
	} catch (e: any) {
		throw new Error('Сталася помилка отримання даних міста')
	}
}

export const checkDetails = async (
	cityRecipient: string,
	weight: number,
	cost: number,
	seatsAmount: number,
	packCount: number
) => {
	try {
		const { data }: { data: ICheckDetails } = await axios.post(
			process.env.NEXT_PUBLIC_API_URL + 'order/checkDetails',
			{
				cityRecipient,
				weight,
				cost,
				seatsAmount,
				packCount,
			},
			await configHeaders()
		)
		return data
	} catch (e: any) {
		throw new Error('Сталася помилка отримання даних міста')
	}
}

export const checkOrderProduct = async (productId: string) => {
	const { data } = await axios.get<ICheckOrderProduct>(
		process.env.NEXT_PUBLIC_API_URL + `order/checkOrderForCom/${productId}`,
		await configHeaders()
	)
	return data
}

export const fetchAcceptOrder = async (orderNumber: string) => {
	try {
		const { data } = await axios.get<string>(
			process.env.NEXT_PUBLIC_API_URL + `order/acceptOrder/${orderNumber}`,
			await configHeaders()
		)

		return data
	} catch (e) {
		console.log(e)
	}
}
export const fetchRejectOrder = async (orderNumber: string) => {
	try {
		const { data } = await axios.get<string>(
			process.env.NEXT_PUBLIC_API_URL + `order/rejectOrder/${orderNumber}`,
			await configHeaders()
		)
		return data
	} catch (e) {
		console.log(e)
	}
}

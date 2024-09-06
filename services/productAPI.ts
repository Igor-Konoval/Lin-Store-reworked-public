import axios from 'axios'
import { configHeaders } from '@/utils/authUtils'
import { IProduct } from '@/types/IProduct'

export const checkOrderProduct = async (productId: string) => {
	const { data } = await axios.get(
		process.env.NEXT_PUBLIC_API_URL + `order/checkOrderForCom/${productId}`,
		await configHeaders()
	)
	return data
}

export const checkIdSaveList = async (id: string) => {
	try {
		const { data } = await axios.get<boolean>(
			process.env.NEXT_PUBLIC_API_URL + `saveList/${id}`,
			await configHeaders()
		)
		return data
	} catch (e) {
		console.log(e)
	}
}

export const getSaveList = async () => {
	try {
		const { data } = await axios.get(
			process.env.NEXT_PUBLIC_API_URL + 'saveList/',
			await configHeaders()
		)

		return data
	} catch (e: any) {
		console.log(e.message)
	}
}

export const selectIdSaveList = async (productId: string) => {
	try {
		const { data } = await axios.post<boolean>(
			process.env.NEXT_PUBLIC_API_URL + 'saveList',
			{
				productId,
			},
			await configHeaders()
		)

		return data
	} catch (e: any) {
		console.log(e.message)
	}
}

export const removeIdSaveList = async (id: string) => {
	try {
		const { data } = await axios.delete<string>(
			process.env.NEXT_PUBLIC_API_URL + `saveList/${id}`,
			await configHeaders()
		)

		return data
	} catch (e: any) {
		console.log(e.message)
	}
}

export const getAuthOldViews = async () => {
	try {
		const { data } = await axios.get<IProduct[]>(
			process.env.NEXT_PUBLIC_API_URL + 'oldViews/',
			await configHeaders()
		)
		return data
	} catch (e: any) {
		throw new Error('Сталася помилка завантаження, спробуйте трохи пізніше')
	}
}

export const updateAuthOldViews = async (product: IProduct) => {
	try {
		const { data } = await axios.put(
			process.env.NEXT_PUBLIC_API_URL + 'oldViews/',
			{
				productId: product._id,
			},
			await configHeaders()
		)

		return data
	} catch (e: any) {
		throw new Error('Сталася помилка, спробуйте трохи пізніше')
	}
}

import { IBrandType } from '@/types/IAdmin'
import { configHeaders } from '@/utils/authUtils'
import axios from 'axios'

export const createProduct = async (form: FormData) => {
	const response = await axios.post(
		process.env.NEXT_PUBLIC_API_URL + 'product',
		form,
		await configHeaders()
	)
	return response
}

export const createBrand = async (addBrand: IBrandType) => {
	const response = await axios.post(
		process.env.NEXT_PUBLIC_API_URL + 'brand',
		addBrand,
		await configHeaders()
	)
	return response
}

export const createType = async (addType: IBrandType) => {
	const response = await axios.post(
		process.env.NEXT_PUBLIC_API_URL + 'type',
		addType,
		await configHeaders()
	)
	return response
}

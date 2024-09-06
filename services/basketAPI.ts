import axios from 'axios'
import { IBasket, IGetBasket, ISelectCount } from '@/types/IBasket'
import { configHeaders } from '@/utils/authUtils'

export const getBasket = async (): Promise<IGetBasket[]> => {
	const { data }: { data: IGetBasket[] } = await axios.get(
		process.env.NEXT_PUBLIC_API_URL + 'basket/basketUser',
		await configHeaders()
	)

	return data
}

export const addBasket = async (
	idProduct: string,
	color: string,
	selectedImg?: string
): Promise<string> => {
	try {
		const { data }: { data: string } = await axios.post<string>(
			process.env.NEXT_PUBLIC_API_URL + 'basket/basketUser',
			{
				selectedProduct: idProduct,
				selectedColor: color,
				selectedImg,
			},
			await configHeaders()
		)

		return data
	} catch (error: any) {
		return error.response.data
	}
}

export const dropBasket = async (
	idProduct: string,
	color: string
): Promise<IBasket> => {
	const { data }: { data: IBasket } = await axios.post(
		process.env.NEXT_PUBLIC_API_URL + 'basket/dropBasketUser',
		{
			selectedProduct: idProduct,
			selectedColor: color,
		},
		await configHeaders()
	)
	return data
}

export const fetchBasket = async (
	productList: ISelectCount[],
	recipientsWarehouse: string,
	cityRecipient: string,
	recipientAddress: string,
	recipientsPhone: string,
	firstname: string,
	surname: string,
	lastname: string,
	email: string
) => {
	const { data } = await axios.post(
		process.env.NEXT_PUBLIC_API_URL + 'order/createDocument',
		{
			productList,
			recipientsWarehouse,
			cityRecipient,
			recipientAddress,
			recipientsPhone,
			firstname,
			surname,
			lastname,
			email,
		},
		await configHeaders()
	)
	return data
}

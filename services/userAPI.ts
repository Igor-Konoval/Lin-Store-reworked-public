import axios from 'axios'
import { IGoogleAuth, IUserProfile } from '@/types/IUser'
import { configHeaders } from '@/utils/authUtils'

export const fetchAuthGoogle = async (dataAuth: IGoogleAuth) => {
	try {
		const { data, status } = await axios.post(
			process.env.NEXT_PUBLIC_API_URL + 'user/googleAuthUser',
			{
				...dataAuth,
			},
			await configHeaders()
		)

		return { data, status }
	} catch (e: any) {
		console.log(e.message)
	}
}

export const getUserProfile = async (): Promise<IUserProfile> => {
	try {
		const { data }: { data: IUserProfile } = await axios.get(
			process.env.NEXT_PUBLIC_API_URL + 'user/userProfile',
			await configHeaders()
		)
		return data
	} catch (e: any) {
		throw new Error('Сталася помилка при отриманні даних користувача')
	}
}

export const registration = async (
	email: string,
	username: string,
	password: string
) => {
	const { data, status } = await axios.post(
		process.env.NEXT_PUBLIC_API_URL + 'user/registration',
		{
			email,
			username,
			password,
		},
		await configHeaders()
	)
	return { data, status }
}

export const login = async (email: string, password: string) => {
	const { data, status, headers, config, request } = await axios.post(
		process.env.NEXT_PUBLIC_API_URL + 'user/login',
		{
			email,
			password,
		},
		await configHeaders()
	)
	return { data, status, headers, config, request }
}

export const updateUserProfile = async (newValues: IUserProfile) => {
	try {
		const { data } = await axios.put(
			process.env.NEXT_PUBLIC_API_URL + 'user/userProfile',
			{
				newValues,
			},
			await configHeaders()
		)
		return data
	} catch (e: any) {
		throw new Error('Сталася помилка, спробуйте трохи пізніше')
	}
}

export const fetchEmailRecoveryPassword = async (email: string) => {
	try {
		const { data } = await axios.post<string>(
			process.env.NEXT_PUBLIC_API_URL + `user/passwordForgot`,
			{
				email,
			}
		)

		return data
	} catch (e: any) {
		throw new Error('Сталася помилка, спробуйте трохи пізніше')
	}
}

export const checkRecoveryLink = async (link: string) => {
	try {
		const { data } = await axios.get<string>(
			process.env.NEXT_PUBLIC_API_URL + `user/checkRecoveryLink/:${link}`
		)

		return data
	} catch (e: any) {
		throw new Error('Сталася помилка, спробуйте трохи пізніше')
	}
}

export const fetchRecoveryPassword = async (link: string, password: string) => {
	try {
		const { data } = await axios.post<string>(
			process.env.NEXT_PUBLIC_API_URL + `user/recoveryPassword/:${link}`,
			{
				password,
			},
			await configHeaders()
		)

		return data
	} catch (e: any) {
		throw new Error('Сталася помилка, спробуйте трохи пізніше')
	}
}

export const logout = async () => {
	try {
		const { data } = await axios.get<string>(
			process.env.NEXT_PUBLIC_API_URL + 'user/logout',
			await configHeaders()
		)

		return data
	} catch (e: any) {
		throw new Error('Сталася помилка, спробуйте трохи пізніше')
	}
}

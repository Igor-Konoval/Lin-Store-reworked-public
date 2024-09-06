import { createDate } from '@/utils/commentUtils'
import { IComment, IUserComments } from '@/types/IComments'
import axios from 'axios'
import { configHeaders } from '@/utils/authUtils'

export const getAllComments = async (id: string): Promise<IComment[]> => {
	return await fetch(
		process.env.NEXT_PUBLIC_API_URL + 'comment/' + id,
		await configHeaders()
	).then(response => response.json())
}

export const createCommentUser = async (
	productId: string,
	rating: number,
	commentData: string,
	commentDate: string
) => {
	try {
		const response = await axios.post(
			process.env.NEXT_PUBLIC_API_URL + 'comment/',
			{
				productId,
				rating,
				commentData,
				commentDate,
			},
			await configHeaders()
		)

		return response.data
	} catch (error: any) {
		return error.response.data
	}
}

export const createResponseCommentUser = async (
	productId: string,
	commentUserId: string,
	mainCommentUserId: string,
	commentData: string,
	commentDate: string
) => {
	try {
		const response = await axios.post(
			process.env.NEXT_PUBLIC_API_URL + 'comment/responseComment',
			{
				commentUserId,
				commentData,
				mainCommentUserId,
				commentDate,
				productId,
			},
			await configHeaders()
		)

		return response.data
	} catch (error: any) {
		return error.response.data
	}
}

export const getUserComments = async () => {
	try {
		const { data }: { data: IUserComments[] } = await axios.get(
			process.env.NEXT_PUBLIC_API_URL + 'comment/commentsUser',
			await configHeaders()
		)

		return data
	} catch (error: any) {
		console.log(error.message)
	}
}

export const removeComment = async (
	productId: string,
	commentUserId: string,
	commentDate: string
) => {
	try {
		const response = await axios.post(
			process.env.NEXT_PUBLIC_API_URL + 'comment/removeComment',
			{
				productId,
				commentUserId,
				commentDate,
			},
			await configHeaders()
		)

		return response.data
	} catch (error: any) {
		return error.response.data
	}
}

export const removeResponseComment = async (
	productId: string,
	responseCommentId: string,
	commentUserId: string
) => {
	try {
		const response = await axios.post(
			process.env.NEXT_PUBLIC_API_URL + 'comment/removeResponseComment',
			{
				productId,
				commentUserId,
				responseCommentId,
				commentDate: createDate(),
			},
			await configHeaders()
		)

		return response.data
	} catch (error: any) {
		return error.response.data
	}
}

export const changeCommentUser = async (
	productId: string,
	commentUserId: string,
	commentData: string
) => {
	try {
		const response = await axios.post(
			process.env.NEXT_PUBLIC_API_URL + 'comment/changeComment',
			{
				productId,
				commentUserId,
				commentData,
			},
			await configHeaders()
		)

		return response.data
	} catch (error: any) {
		return error.response.data
	}
}

export const changeResponseCommentUser = async (
	responseCommentUserId: string,
	productId: string,
	commentUserId: string,
	commentData: string
) => {
	try {
		const response = await axios.post(
			process.env.NEXT_PUBLIC_API_URL + 'comment/changeResponseComment',
			{
				responseCommentUserId,
				productId,
				commentUserId,
				commentData,
			},
			await configHeaders()
		)

		return response.data
	} catch (error: any) {
		return error.response.data
	}
}

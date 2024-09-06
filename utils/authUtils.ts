import { getSession } from 'next-auth/react'

export async function getToken(): Promise<{} | null> {
	const session = await getSession()
	const token = session?.user.token
	return (await token) || null
}

export async function configHeaders(addHeaders: string[] = []): Promise<any> {
	const config = {
		withCredentials: true,
		headers: {
			Authorization: 'Bearer ' + (await getToken()),
			...addHeaders,
		},
	}
	return config
}

import { roles } from '@/enums/roles'
import { type DefaultSession } from 'next-auth'
declare module 'next-auth' {
	interface Session {
		user: {
			role: string
			userId: string
			name: string
			token: string
		} & DefaultSession['user'] // Ensure to include original user properties
	}
}
declare module 'next-auth/jwt' {
	interface JWT {
		role: string
		userId: string
		username: string
	}
}

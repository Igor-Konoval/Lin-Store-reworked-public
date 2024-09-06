import Credentials from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import jwt from 'jsonwebtoken'
import { roles } from '@/enums/roles'
import clientPromise from '@/lib/db'
import { Account, AuthOptions, Session, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { AdapterUser } from 'next-auth/adapters'
import { fetchAuthGoogle, login, registration } from '@/services/userAPI'
import { type WithId } from 'mongodb'
import { CustomAuthError, getCookieValue } from '@/utils/serviceUtils'
import { cookies } from 'next/headers'
import { Profile } from 'next-auth'

interface CustomUser extends User {
	checkbox?: string
	username?: string
	password?: string
}

interface CustomAdapterUser extends AdapterUser {
	checkbox?: string
	username?: string
	password?: string
}

interface IUserPayload {
	OAuthUserInfo: WithId<any> | null
	userInfo: WithId<any> | null
}

const userPayload: IUserPayload = {
	OAuthUserInfo: null,
	userInfo: null,
}

export const authConfig: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		Credentials({
			credentials: {
				email: { label: 'email', type: 'email', required: true },
				password: { label: 'password', type: 'password', required: true },
				username: { label: 'username', type: 'username', required: false },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) {
					return null
				}

				return credentials as CustomUser
			},
		}),
	],
	pages: { signIn: '/auth/login' },
	callbacks: {
		async signIn(result: {
			user: CustomUser | CustomAdapterUser
			account: Account | null
			profile?: Profile | undefined
			email?: {
				verificationRequest?: boolean
			}
		}) {
			try {
				if (result.user) {
					const client = await clientPromise

					const OAuthUserInfo = await client
						.db()
						.collection('googleusers')
						.findOne({ email: result.user.email })

					const userInfo = await client
						.db()
						.collection('users')
						.findOne({ email: result.user.email })
					userPayload.OAuthUserInfo = OAuthUserInfo
					userPayload.userInfo = userInfo

					if (result.user.checkbox === undefined) {
						if (userInfo) {
							throw new CustomAuthError(
								401,
								'Даний email не може бути використаний у цій авторизації'
							)
						} else if (!OAuthUserInfo) {
							const res = await fetchAuthGoogle({
								email: result.user.email!,
								uid: result.user.id,
								username: result.user.name!,
							})
							if (res) {
								userPayload.OAuthUserInfo = res.data
							}
						}
					}
					if (result.user.checkbox === 'true') {
						if (userPayload.OAuthUserInfo) {
							throw new CustomAuthError(401, 'Даний email вже зайнятий')
						}
						if (userPayload.userInfo) {
							throw new CustomAuthError(401, 'Даний email вже зайнятий')
						}
						const res = await registration(
							result.user.email!,
							result.user.username!,
							result.user.password!
						)

						if (res) {
							userPayload.userInfo = res.data
						}
					}
					if (result.user.checkbox === 'false') {
						if (userPayload.OAuthUserInfo) {
							throw new CustomAuthError(
								401,
								'Сталася помилка. Цей email не може використовуватись в даній авторизації'
							)
						}

						const res = await login(result.user.email!, result.user.password!)
						if (res) {
							userPayload.userInfo = res.data
						}
					}
				}

				return true
			} catch (error: any) {
				const parseCookies = cookies()
					.getAll()
					.find(value => value.name === 'countFailAuth')

				if (parseCookies) {
					const countFail = getCookieValue(parseCookies.value)
					if (countFail) {
						const parseCookies = JSON.parse(countFail)

						if (parseCookies.count >= 4) {
							cookies().set('failAuthBlock', JSON.stringify(parseCookies), {
								maxAge: 180,
							})
							throw new Error(
								'Перевищено кількість спроб авторизації, буде доступно через 3 хвилини'
							)
						}
					}
				}

				if (error instanceof CustomAuthError) {
					throw new Error(`${error.message}`)
				}
				if (error.response.status === 401) {
					throw new Error(`${error.response.data.message}`)
				}

				throw new Error('Сталася непередбачувана помилка')
			}
		},
		async session({ session, token }: { session: Session; token: JWT }) {
			try {
				session.user.role = token.role
				session.user.userId = token.userId
				session.user.name = token.username
				session.user.token = jwt.sign(
					token,
					process.env.NEXTAUTH_SECRET as string
				)

				return session
			} catch (e) {
				console.log(e, 'session error')
				return session
			}
		},
		async jwt({
			token,
			user,
		}: {
			token: JWT & { error?: string }
			user: CustomUser | CustomAdapterUser
		}) {
			try {
				if (user) {
					if (user.checkbox === undefined) {
						if (userPayload.OAuthUserInfo) {
							token.role = userPayload.OAuthUserInfo.role || roles['User']
							token.username = userPayload.OAuthUserInfo.username
							token.userId = JSON.parse(
								JSON.stringify(userPayload.OAuthUserInfo._id)
							)
							return token
						}
					} else if (userPayload.userInfo) {
						token.role = userPayload.userInfo.role || roles['User']
						token.username = userPayload.userInfo.username
						token.userId = JSON.parse(JSON.stringify(userPayload.userInfo._id))
						return token
					}
				}

				return token
			} catch (e: any) {
				console.log(e, 'token error')
				return token
			}
		},
	},
}

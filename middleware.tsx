import { roles } from './enums/roles'
import { getToken } from 'next-auth/jwt'
import { NextResponse, type NextRequest } from 'next/server'

const routes = ['/order', '/saved-products', '/basket', '/comments-list']
const authRoutes = [
	'/auth/login',
	'/auth/registration',
	'/auth/recoveryPassword',
	'/auth/forgotPassword',
]
export async function middleware(req: NextRequest) {
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

	if (req.nextUrl.pathname.startsWith('/admin')) {
		if (!token || token.role !== roles['Admin']) {
			return new NextResponse('Not found', { status: 404 })
		}
	}

	if (authRoutes.includes(req.nextUrl.pathname)) {
		if (token !== null) {
			const url = req.nextUrl.clone()
			url.pathname = '/'
			return NextResponse.redirect(url)
		}
	}

	if (routes.includes(req.nextUrl.pathname)) {
		if (!token) {
			const url = req.nextUrl.clone()
			url.pathname = '/api/auth/auth'
			return NextResponse.redirect(url)
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/admin', ...routes],
}

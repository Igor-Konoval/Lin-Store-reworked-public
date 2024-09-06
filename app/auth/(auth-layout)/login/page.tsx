import Login from '@/components/Login'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Авторизація користувача | Lin-Store',
}

function Page() {
	return <Login />
}

export default Page

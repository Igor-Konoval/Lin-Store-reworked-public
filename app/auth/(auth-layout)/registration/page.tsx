import Registration from '@/components/Registration'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Реєстрація користувача | Lin-Store',
}

export default function Page() {
	return <Registration />
}

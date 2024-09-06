import { Metadata } from 'next'
import Order from '../../components/Order'

export const metadata: Metadata = {
	title: 'Замовлення користувача',
}

export default function Page() {
	return <Order />
}

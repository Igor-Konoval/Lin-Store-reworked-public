import { Metadata } from 'next'
import Basket from '../../components/Basket'

export const metadata: Metadata = {
	title: 'Кошик користувача',
}

export default function Page() {
	return <Basket />
}

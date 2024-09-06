import { Metadata } from 'next'
import SavedProducts from '../../components/SavedProducts'

export const metadata: Metadata = {
	title: 'Збережені товари',
}

export default function page() {
	return <SavedProducts />
}

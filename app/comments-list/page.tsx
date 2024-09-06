import { Metadata } from 'next'
import CommentsList from '../../components/CommentsList'

export const metadata: Metadata = {
	title: 'Коментарі користувача',
}

export default function Page() {
	return <CommentsList />
}

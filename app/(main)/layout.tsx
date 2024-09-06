import ViewedList from '@/components/ViewedList'
import FilterBar from '../../components/FilterBar'
import PageBar from '../../components/PageBar'
import styles from './page.module.css'

export default function MainPageLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<main className={styles['main']}>
			<section>
				<FilterBar />
				{children}
				<PageBar />
				<ViewedList />
			</section>
		</main>
	)
}

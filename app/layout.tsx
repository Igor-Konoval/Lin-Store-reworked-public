import AlertDismissible from '@/components/AlertDismissible'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { Providers } from '@/components/Providers'
import '@/styles/Container.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'
import { Container } from 'react-bootstrap'
import AlertError from '../components/AlertError'
import BrandProvider from '../contexts/BrandContext/BrandContextProvider'
import PageProvider from '../contexts/PageContext/PageContextProvider'
import PriceProvider from '../contexts/PriceContext/PriceContextProvider'
import SearchProvider from '../contexts/SearchContext/SearchContextProvider'
import SortProvider from '../contexts/SortContext/SortContextProvider'
import TypeProvider from '../contexts/TypeContext/TypeContextProvider'
import ViewedListProvider from '../contexts/ViewedListContext/ViewedListContextProvider'
import AlertPrivacyPolicy from '@/components/AlertPrivacyPolicy'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: {
		default: 'Інтернет-магазин Lin-Store',
		template: '%s - Lin-Store',
	},
	description:
		'Інтернет магазин Lin-Store - різний асортимент товарів для покупок по Україні: електроніка, повсякденні товари, навушники, товари для дому!',
	openGraph: {
		title: 'Інтернет-магазин Lin-Store',
		siteName: 'Lin-Store',
		locale: 'uk_UA',
		url: process.env.NEXTAUTH_URL,
		type: 'website',
		images: [
			// {
			// 	url: 'https://storage.googleapis.com/lin-store-bucket/11513180-c075-4fa5-bc8d-21482667f1aa.jpg',
			// 	width: 101,
			// 	height: 109,
			// 	alt: 'Lin-Store',
			// },
			// {
			// 	url: 'https://storage.googleapis.com/lin-store-bucket/middleLogo.jpg',
			// 	width: 250,
			// 	height: 280,
			// 	alt: 'Lin-Store',
			// },
			// {
			// 	url: '/Lin-StoreLogo.jpg',
			// 	width: 504,
			// 	height: 214,
			// 	alt: 'Lin-Store',
			// },
		],
	},
	// icons: {
	// 	icon: 'https://storage.googleapis.com/lin-store-bucket/11513180-c075-4fa5-bc8d-21482667f1aa.jpg',
	// 	apple:
	// 		'https://storage.googleapis.com/lin-store-bucket/11513180-c075-4fa5-bc8d-21482667f1aa.jpg',
	// },
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<SearchProvider>
					<SortProvider>
						<PageProvider>
							<TypeProvider>
								<BrandProvider>
									<PriceProvider>
										<Providers>
											<Header />
											<ViewedListProvider>
												<Container fluid={true} className={'container-page'}>
													{children}
													<article>
														<AlertDismissible />
														<AlertError />
														<AlertPrivacyPolicy />
													</article>
												</Container>
											</ViewedListProvider>
											<Footer />
										</Providers>
									</PriceProvider>
								</BrandProvider>
							</TypeProvider>
						</PageProvider>
					</SortProvider>
				</SearchProvider>
			</body>
		</html>
	)
}

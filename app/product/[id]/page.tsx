import SelectedProduct from '@/components/SelectedProduct'
import { IProduct } from '@/types/IProduct'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
	const products: IProduct[] = await fetch(
		process.env.NEXT_PUBLIC_API_URL + 'product'
	)
		.then(response => response.json())
		.then(response => response.productList)

	return products.map(product => ({
		id: product.name,
	}))
}

type Props = {
	params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const product = await fetch(
		process.env.NEXT_PUBLIC_API_URL + 'product/' + decodeURIComponent(params.id)
	).then(response => response.json())

	if (product == 'такого товару не існує' || product == 'Виникла помилка') {
		return {
			title: 'Не існує',
		}
	}

	return {
		title: `${product?.name} в Lin-Store - Відмінні пропозиції за вигідною ціною!`,
		description: `${product?.shortDescription}. Зручна доставка по Україні, відгуки, рейтинг, доступний вибір та цінової категорії.!`,
		openGraph: {
			images: [{ url: product.img[0] }],
		},
	}
}

export default async function Page({ params }: Props) {
	const product = await fetch(
		process.env.NEXT_PUBLIC_API_URL +
			'product/' +
			decodeURIComponent(params.id),
		{
			next: { revalidate: 60 },
		}
	).then(response => response.json())
	if (product == 'такого товару не існує' || product == 'Виникла помилка') {
		return notFound()
	}

	return <SelectedProduct product={product} />
}

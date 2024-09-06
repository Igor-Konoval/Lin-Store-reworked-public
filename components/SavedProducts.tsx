'use client'
import SavedItemComponent from '@/components/SavedItemComponent'
import { getSaveList } from '@/services/productAPI'
import '@/styles/SaveList.css'
import { ISelectedProduct } from '@/types/IProduct'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import { Row } from 'react-bootstrap'
import LoadSpinner from './LoadSpinner'

const SavedProducts: FC = () => {
	const [saveList, setSaveList] = useState<ISelectedProduct[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)

	useEffect(() => {
		getSaveList()
			.then(response => setSaveList(response))
			.then(value => setIsLoading(false))
	}, [])

	const handlerRemove = (id: string) => {
		setSaveList(prevState => prevState.filter(prev => prev._id !== id))
	}

	if (isLoading) {
		return (
			<div style={{ minHeight: '90vh' }}>
				<LoadSpinner title={'Завантаження сторінки...'} />
			</div>
		)
	}

	if (saveList.length === 0) {
		return (
			<>
				<h1 className='fs-1 mt-4 mb-5'>Список збережень</h1>
				<div className='d-flex justify-content-center align-items-center text-muted notSaves'>
					<div>
						У вас немає збережених товарів
						<Image
							className='ms-1 opacity-75'
							alt='icon_sad_smile'
							quality={20}
							src={process.env.NEXT_PUBLIC_API_URL + 'pngegg.png'}
							width={40}
							height={40}
						/>
					</div>
				</div>
			</>
		)
	}

	return (
		<main>
			<div style={{ minHeight: '90vh' }}>
				<h1>Список збережень</h1>
				<Row>
					{saveList.map((product, id) => (
						<SavedItemComponent
							key={id}
							product={product}
							handlerRemove={handlerRemove}
						/>
					))}
				</Row>
			</div>
		</main>
	)
}

export default SavedProducts

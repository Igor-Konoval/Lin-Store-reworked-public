import React, { FC, useState, useRef, useEffect } from 'react'
import { Card, Carousel, Col, Row } from 'react-bootstrap'
import '@/styles/ViewedListSlider.css'
import { IProduct } from '@/types/IProduct'
import { useRouter } from 'next/navigation'
import { checkRating } from './ratingUtils'

interface IOldViewsSlider {
	products: IProduct[]
}

const OldViewsSlider: FC<IOldViewsSlider> = ({ products }) => {
	const carouselRef = useRef<any>(null)
	const [startX, setStartX] = useState(null)
	const [itemsPerPage, setItemsPerPage] = useState<number>(
		calculateItemsPerPage()
	)

	const router = useRouter()
	const handleTouchStart = (e: any) => {
		setStartX(e.touches[0].clientX)
	}

	const handleTouchMove = (e: any) => {
		if (startX !== null) {
			const diffX: number = e.touches[0].clientX - startX
			if (diffX > 50) {
				carouselRef.current.prev()
			} else if (diffX < -50) {
				carouselRef.current.next()
			}
			setStartX(null)
		}
	}

	function calculateItemsPerPage(): 6 | 4 | 3 {
		const windowWidth = window.innerWidth
		return windowWidth >= 992 ? 6 : windowWidth >= 576 ? 4 : 3
	}

	useEffect(() => {
		function handleResize() {
			setItemsPerPage(calculateItemsPerPage())
		}

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	const carouselItems = []
	if (!Array.isArray(products)) {
		return <div>Виконується авторизація</div>
	} else {
		for (let i = 0; i < products.length; i += itemsPerPage) {
			const group = products.slice(i, i + itemsPerPage)
			const carouselItem = (
				<Carousel.Item key={i}>
					<Row key={i} className='flex-nowrap oldView-item'>
						{group.map((product, index) => (
							<Col
								onClick={() => {
									router.push('/product/' + product.name)
								}}
								key={index}
								lg={2}
								sm={3}
								xs={4}
								className='d-flex justify-content-evenly container-body-oldViews'
							>
								<Card
									style={{
										border: 'none',
										boxShadow: 'rgb(103 103 103 / 18%) 0px 0px 3px 1px',
										cursor: 'pointer',
										width: '100%',
									}}
									className='d-flex justify-content-between my-1'
								>
									<Card.Img
										className='card-oldViews-img'
										src={`${
											Array.isArray(product.img) ? product.img[0] : product.img
										}`}
									/>
									<Card.Body className='d-flex flex-column justify-content-evenly card-body-oldViews'>
										<Row className='d-flex justify-content-between align-content-center my-1 card-product-name'>
											<Col>{product.name}</Col>
										</Row>
										<Row>
											<Col className='d-flex my-1 px-1 container-totalRating'>
												{checkRating(product.totalRating)}
												<span className='text-muted ms-1'>{`(${product.countRating})`}</span>
											</Col>
										</Row>
										<Row className='mt-1'>
											<Col className='text-end'>{`${product.price} грн.`}</Col>
										</Row>
									</Card.Body>
								</Card>
							</Col>
						))}
					</Row>
				</Carousel.Item>
			)
			carouselItems.push(carouselItem)
		}
	}

	return (
		<Carousel
			className='mb-5'
			interval={null}
			style={{ height: 'max-content' }}
			defaultActiveIndex={0}
			ref={carouselRef}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
		>
			{carouselItems}
		</Carousel>
	)
}

export default OldViewsSlider

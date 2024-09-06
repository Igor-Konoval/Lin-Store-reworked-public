import OverlayTriggerComponent from '@/components/OverlayTriggerComponent'
import { checkRating } from '@/components/ratingUtils'
import { LOGIN_ROUTE } from '@/consts/links'
import { addBasket } from '@/services/basketAPI'
import { removeIdSaveList } from '@/services/productAPI'
import styles from '@/styles/Product.module.css'
import { ISelectedProduct } from '@/types/IProduct'
import { lengthShortDesc } from '@/utils/productUtils'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC, useRef, useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import AlertBasket from './AlertBasket'

const SavedItemComponent: FC<{
	product: ISelectedProduct
	handlerRemove: (id: string) => void
}> = ({ product, handlerRemove }) => {
	const [message, setMessage] = useState<string>('')
	const [show, setShow] = useState<boolean>(false)
	const target = useRef(null)

	const checkCount = product.colors.find(item => item.count !== 0)

	const router = useRouter()
	const { status } = useSession()
	const clickHandler = (id: string, color: string) => {
		;(async () => {
			if (status === 'authenticated') {
				const dataBasket = await addBasket(id, color)
				setMessage(dataBasket)
				setShow(true)
				setTimeout(() => setShow(false), 2400)
			} else if (status === 'unauthenticated') {
				router.push(LOGIN_ROUTE)
			}
		})()
	}

	return (
		<Col
			as='article'
			role='article'
			xs={12}
			sm={4}
			md={4}
			lg={3}
			xl={3}
			className={styles['container-card-body-product']}
		>
			<Card
				onClick={event => router.push('/product/' + product.name)}
				className={styles['card-product']}
			>
				<Image
					width={291}
					height={291}
					alt='product_image'
					quality={50}
					className={[
						styles['card-img-product'],
						product.count !== 0 ? '' : styles['card-img-product-noActive'],
					].join(' ')}
					src={product.img[0]}
				/>

				<Card.Body className={styles['card-body-product']}>
					<OverlayTriggerComponent
						component={
							<span
								className={'saveList-item'}
								onClick={async e => {
									e.stopPropagation()
									const response = await removeIdSaveList(product._id)
									if (response === 'ok') {
										handlerRemove(product._id)
									}
								}}
							>
								<Image
									width={25}
									height={25}
									src={process.env.NEXT_PUBLIC_API_URL + 'icons8-close-24.png'}
									alt='image_close_icon'
								/>
							</span>
						}
						messageValue={'видалити з обраних'}
					/>
					<Row
						as='header'
						role='rowheader'
						className={
							'd-flex justify-content-between align-content-center my-1' +
							' ' +
							styles['card-body-product-centered']
						}
					>
						<Col sm={8} xs={12}>
							{product.name}
						</Col>
						<Col
							sm={4}
							xs={12}
							className={'text-end' + ' ' + styles['default-product-price']}
						>{`${product.price} грн.`}</Col>
					</Row>
					<Row>
						<Col
							className={'text-muted' + ' ' + styles['card-product-shortDesc']}
						>
							{lengthShortDesc(product.shortDescription)}
						</Col>
					</Row>
					<Row className='d-flex align-items-center'>
						<Col className='d-flex my-1'>
							{checkRating(product.totalRating)}
							<span className='text-muted ms-1'>{`(${product.countRating})`}</span>
						</Col>
						{product.countSales !== 0 ? (
							<Col
								xl={5}
								xs={12}
								className='text-muted fw-semibold fs-6'
							>{`продажів ${product.countSales}`}</Col>
						) : (
							''
						)}
					</Row>
					<Row>
						<Col
							sm={4}
							xs={12}
							className={
								'text-end' + ' ' + styles['small-screen-product-price']
							}
						>{`${product.price} грн.`}</Col>
						<Col className='d-flex justify-content-end'>
							{checkCount !== undefined ? (
								product.colors[0].count !== 0 ? (
									<Button
										ref={target}
										onClick={e => {
											e.stopPropagation()
											clickHandler(product._id, product.colors[0].color)
										}}
										variant='outline-dark'
										size='lg'
										className={
											'd-flex align-items-center' +
											' ' +
											styles['button-add-basket']
										}
									>
										{' '}
										в корзину
										<Image
											className='ms-2'
											width={25}
											height={25}
											src={
												process.env.NEXT_PUBLIC_API_URL + 'add-to-basket.png'
											}
											alt='image_add_to_basket'
										/>
									</Button>
								) : (
									<p className={styles['info-notAvailable']}>
										Доступні інші кольори
									</p>
								)
							) : (
								<p className={styles['info-notAvailable']}>Немає в наявності</p>
							)}
						</Col>
					</Row>
				</Card.Body>
			</Card>
			<AlertBasket show={show} message={message} target={target} />
		</Col>
	)
}

export default SavedItemComponent

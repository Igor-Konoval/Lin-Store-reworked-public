'use client'
import { checkRating } from '@/components/ratingUtils'
import { LOGIN_ROUTE } from '@/consts/links'
import { addBasket } from '@/services/basketAPI'
import styles from '@/styles/Product.module.css'
import { IProduct } from '@/types/IProduct'
import { lengthShortDesc } from '@/utils/productUtils'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { MutableRefObject, useRef, useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import AlertBasket from './AlertBasket'

export default function Product({ product }: { product: IProduct }) {
	const session = useSession()
	const router = useRouter()
	const [message, setMessage] = useState<string>('')
	const [show, setShow] = useState<boolean>(false)
	const target: MutableRefObject<HTMLButtonElement | null> = useRef(null)
	const checkCount = product.colors.find(item => item.count !== 0)

	const clickHandler = (id: string, color: string) => {
		;(async () => {
			if (session.data?.user && session.status === 'authenticated') {
				const dataBasket = await addBasket(id, color)
				setMessage(dataBasket)
				setShow(true)
				setTimeout(() => setShow(false), 2400)
			} else if (session.status === 'unauthenticated') {
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
				className={styles['card-product']}
				onClick={event => router.push('/product/' + product.name)}
			>
				<Image
					className={[
						styles['card-img-product'],
						product.count !== 0 ? '' : styles['card-img-product-noActive'],
					].join(' ')}
					quality={40}
					width={320}
					height={350}
					alt='product_image'
					src={`${product.img[0]}`}
				/>
				<Card.Body className={styles['card-body-product']}>
					<Row
						className={[
							'd-flex',
							'justify-content-between',
							'align-content-center',
							'my-1',
							styles['card-body-product-centered'],
						].join(' ')}
						as='header'
						role='rowheader'
					>
						<Col sm={8} xs={12}>
							{product.name}
						</Col>
						<Col
							sm={4}
							xs={12}
							className={['text-end', styles['default-product-price']].join(
								' '
							)}
						>
							{`${product.price} грн.`}
						</Col>
					</Row>
					<Row>
						<Col
							className={['text-muted', styles['card-product-shortDesc']].join(
								' '
							)}
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
							<Col xl={5} xs={12} className='text-muted fw-semibold fs-6'>
								{`продажів ${product.countSales}`}
							</Col>
						) : (
							''
						)}
					</Row>
					<Row>
						<Col
							sm={4}
							xs={12}
							className={[
								'text-end',
								styles['small-screen-product-price'],
							].join(' ')}
						>
							{`${product.price} грн.`}
						</Col>
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
										className='d-flex align-items-center button-add-basket'
									>
										{' '}
										В кошик
										<Image
											className='ms-2'
											width={25}
											height={25}
											alt={'button_basket'}
											src={
												process.env.NEXT_PUBLIC_API_URL + 'add-to-basket.png'
											}
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

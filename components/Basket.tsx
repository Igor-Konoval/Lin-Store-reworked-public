'use client'
import { checkRating } from '@/components/ratingUtils'
import { dropBasket, getBasket } from '@/services/basketAPI'
import '@/styles/Basket.css'
import { IGetBasket, ISelectCount } from '@/types/IBasket'
import { createEventBlueError, createEventRedError } from '@/utils/serviceUtils'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { Button, ButtonGroup, Col, Navbar, Row } from 'react-bootstrap'
import AlertCreateOrder from './AlertCreateOrder'
import LoadSpinner from './LoadSpinner'
import ModalPostalComponent from './ModalPostalComponent'

const Basket: FC = () => {
	const [basket, setBasket] = useState<IGetBasket[]>([])
	const [loading, setLoading] = useState(true)
	const [selectedCountProduct, setSelectedCountProduct] = useState<
		ISelectCount[]
	>([])
	const [selectedProducts, setSelectedProducts] = useState<ISelectCount[]>([])
	const [totalPrice, setTotalPrice] = useState<number>(0)
	const [show, setShow] = useState<boolean>(false)
	const [showPostal, setShowPostal] = useState<boolean>(false)

	const router = useRouter()
	const showAlert = async () => {
		setShow(true)
		const promise = new Promise<void>(resolve => {
			setTimeout(() => {
				setShowPostal(false)
				setShow(false)
				resolve()
			}, 2500)
		})
		return await promise
	}

	const loadBasketPage = async () => {
		try {
			const response = await getBasket()
			setBasket(response)

			setTotalPrice(0)
			setLoading(false)
			setSelectedCountProduct(
				response.map((value): ISelectCount & { selectedImg: string } => ({
					name: value.name,
					img: value.img,
					isActive: value.isActive,
					selectedCount: 0,
					_id: value._id,
					selectedColor: value.selectedColor,
					selectedImg: value.selectedImg,
					countProduct:
						value.colors.find(item => item.color === value.selectedColor)
							?.count || 0,
					countedPrice: 0,
					price: value.price,
				}))
			)
		} catch (error) {
			createEventRedError(
				'Виникла помилка',
				'Помилка завантаження кошика, перезавантажте сторінку'
			)
			setLoading(false)
		}
	}

	useEffect(() => {
		;(async () => await loadBasketPage())()
	}, [])

	const basketHandler = async (id: string, color: string) => {
		try {
			await dropBasket(id, color)

			setBasket(prevBasket => prevBasket.filter(product => product._id !== id))
			const reProductList: ISelectCount[] = [...selectedCountProduct].filter(
				value => value._id !== id
			)
			const reTotalPrice: number =
				[...selectedCountProduct].find(value => value._id == id)
					?.countedPrice || 0

			setTotalPrice(prevState => prevState - reTotalPrice)
			setSelectedCountProduct(reProductList)
		} catch (error) {
			createEventRedError(
				'Помилка дії',
				'Виникла помилка при видаленні товару з кошика'
			)
		}
	}
	const reProductList = useCallback(
		(selectedProducts: ISelectCount[]): ISelectCount[] => {
			return [...selectedProducts].filter(value => value.selectedCount !== 0)
		},
		[selectedProducts]
	)

	const onClickHandler = async () => {
		await showAlert().then(result => {
			setLoading(true)
			loadBasketPage()
		})
	}

	const incrCountTotalPrice = (value: ISelectCount) => {
		value.countedPrice = value.price * value.selectedCount
		setTotalPrice(prevState => prevState + value.price)
		return value.countedPrice
	}

	const decrCountTotalPrice = (value: ISelectCount) => {
		value.countedPrice = value.price * value.selectedCount
		setTotalPrice(prevState => prevState - value.price)
		return value.countedPrice
	}

	const handlerOnIncrementCount = (index: number) => {
		const reSelectCount: ISelectCount[] = [...selectedCountProduct]
		const current = reSelectCount[index]
		if (current.countProduct !== current.selectedCount) {
			current.selectedCount += 1
			current.countedPrice = incrCountTotalPrice(current)
		} else {
			return false
		}
		setSelectedCountProduct(reSelectCount)
	}

	const handlerOnDecrementCount = (index: number) => {
		const reSelectCount: ISelectCount[] = [...selectedCountProduct]
		const current = reSelectCount[index]
		if (current.selectedCount > 0) {
			reSelectCount[index].selectedCount -= 1
			current.countedPrice = decrCountTotalPrice(current)
		} else {
			return false
		}
		setSelectedCountProduct(reSelectCount)
	}

	if (loading) {
		return <LoadSpinner title='Кошик користувача' />
	}

	if (!basket.length) {
		return (
			<>
				<h1 className='fs-1 mt-4 mb-5'>Кошик користувача</h1>
				<div className='d-flex justify-content-center align-items-center text-muted empty-basket'>
					Кошик порожній
					<Image
						className='ms-1 opacity-75'
						alt='icon'
						src={process.env.NEXT_PUBLIC_API_URL + 'pngegg.png'}
						width={40}
						height={40}
					/>
				</div>
			</>
		)
	}

	return (
		<>
			<h1 className='fs-1 mt-4 mb-5'>Кошик користувача</h1>
			<section className='container-basket-page'>
				{show && <AlertCreateOrder />}
				<main>
					{basket.map((product: IGetBasket, index) => (
						<React.Fragment key={index}>
							<Row
								as='article'
								role='article'
								key={product._id}
								className='d-flex align-items-center flex-nowrap my-4 mx-auto basket-item'
							>
								<Col xs='3' className='container-basket-img'>
									<Image
										className='basket-item-img'
										alt='image_basket_icon'
										width={350}
										height={350}
										onClick={() => {
											try {
												router.push('/product/' + product.name)
											} catch (e) {
												createEventRedError(
													'Помилка дії',
													'Виникла помилка при перенаправленні користувача'
												)
											}
										}}
										src={
											product.selectedImg !== 'none'
												? product.selectedImg
												: product.img[0]
										}
									/>
								</Col>
								<Col xs='3'>
									<Row
										style={{ cursor: 'pointer' }}
										className='d-flex flex-column'
									>
										<Col className='basket-item-name'>
											<div role='rowheader'>{`${product.name} (${product.selectedColor})`}</div>
										</Col>
										<Col className='d-flex align-items-center container-totalRating'>
											{checkRating(product.totalRating)}
											<span className='ms-2'>{`(${product.countRating})`}</span>
										</Col>
										<Col className='text-muted basket-item-desc'>
											{product.shortDescription}
										</Col>
									</Row>
								</Col>
								<Col
									xs='3'
									className='d-flex flex-column align-items-center justify-content-between'
								>
									<ButtonGroup size='lg' aria-label='Basic example'>
										<Button
											onClick={() => {
												handlerOnDecrementCount(index)
											}}
											variant='outline-dark'
										>
											-
										</Button>
										<Button disabled variant='outline-dark'>
											{selectedCountProduct[index].selectedCount}
										</Button>
										<Button
											onClick={() => {
												handlerOnIncrementCount(index)
											}}
											variant='outline-dark'
										>
											+
										</Button>
									</ButtonGroup>
									<div className='ms-1 my-2 basket-item-count'>
										{product.colors.find(
											item => item.color === product.selectedColor
										)?.count + ' залишилося'}
									</div>
								</Col>
								<Col xs='2' className='text-center basket-item-price'>
									<div>{product.price + ' грн'}</div>
								</Col>
								<Col
									xs='1'
									onClick={async () => {
										try {
											await basketHandler(product._id, product.selectedColor)
										} catch (e) {
											createEventRedError(
												'Помилка дії',
												'Виникла помилка обробки товару, ймовірно, ми не можемо обробити цей товар'
											)
										}
									}}
									className='d-flex align-items-center flex-column container-basket-drop'
								>
									<Image
										className='basket-item-drop-img'
										alt='image_trash_drop_icon'
										width={50}
										height={50}
										src={process.env.NEXT_PUBLIC_API_URL + 'trash.png'}
									/>
									<div>видалити</div>
								</Col>
							</Row>
						</React.Fragment>
					))}
				</main>
				<article>
					<Navbar
						expand={'lg'}
						className='bg-body-tertiary'
						fixed='bottom'
						style={{
							padding: '1% 5%',
							fontWeight: '600',
						}}
					>
						<div
							className='d-flex flex-nowrap align-items-center justify-content-end'
							style={{
								width: '100%',
							}}
						>
							<div className='mx-5'>{`Поточна сума: ${totalPrice} грн.`}</div>
							<Button
								disabled={!totalPrice}
								style={{ borderRadius: 50 }}
								onClick={() => {
									try {
										const reProductList: ISelectCount[] = [
											...selectedCountProduct,
										].filter(value => value.selectedCount !== 0)
										setSelectedProducts(reProductList)
										setShowPostal(true)
									} catch (e) {
										createEventBlueError(
											'Помилка виконання',
											'Ймовірно, ви вибрали відсутній товар на складі'
										)
									}
								}}
								size='lg'
								variant='outline-dark'
							>
								Перейти до створення замовлення
							</Button>
						</div>
					</Navbar>
				</article>
			</section>
			<article>
				<ModalPostalComponent
					show={showPostal}
					totalPrice={totalPrice}
					reProductList={() => reProductList(selectedProducts)}
					onHide={() => setShowPostal(false)}
					onClickHandler={async () => {
						await onClickHandler()
					}}
				/>
			</article>
		</>
	)
}

export default Basket

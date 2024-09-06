'use client'
import { cancelOrder, getOrderUser } from '@/services/postalAPI'
import '@/styles/Order.css'
import { IOrder } from '@/types/IOrder'
import { IStatusCode } from '@/types/IService'
import { createEventBlueError } from '@/utils/serviceUtils'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { FC, useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import LoadSpinner from './LoadSpinner'
import { checkRating } from './ratingUtils'

type OrderState =
	| { type: 'orders'; orders: IOrder[] }
	| { type: 'error'; error: IStatusCode }

const Order: FC = () => {
	const [loading, setLoading] = useState<boolean>(true)
	const [order, setOrder] = useState<OrderState>({ type: 'orders', orders: [] })
	const [fetchCancelOrder, setFetchCancelOrder] = useState<string>('')
	const [isFetching, setIsFetching] = useState<boolean>(false)

	const router = useRouter()

	useEffect(() => {
		;(async () => {
			try {
				const response = await getOrderUser()
				setOrder({ type: 'orders', orders: response })
				setLoading(false)
			} catch (e: any) {
				setLoading(false)
				if (e.status === 408) {
					setOrder({ type: 'error', error: { statusCode: 408 } })
				}
			}
		})()
	}, [fetchCancelOrder])

	const handleDropdownStatus = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		const target = (e.target as HTMLDivElement).closest(
			'.container-showHistory'
		)?.previousSibling as HTMLDivElement

		const imgTarget = e.currentTarget.querySelector('img')
		imgTarget?.classList.toggle('img-hideHistory')
		imgTarget?.classList.toggle('img-showHistory')

		target.classList.toggle('status-item-hide')
		target.classList.toggle('status-item-show')
	}

	if (loading) {
		return (
			<>
				<LoadSpinner title='Замовлення користувача' />
			</>
		)
	}

	if (order.type === 'error' && order.error.statusCode === 408) {
		return (
			<>
				<h1 className='fs-1 mt-4 mb-5'>Замовлення користувача</h1>
				<div style={{ minHeight: '60vh' }}>
					<div>
						Помилка, час очікування відповіді минув, перезавантажте сторінку
					</div>
				</div>
			</>
		)
	}

	if (order.type === 'orders' && !order.orders.length) {
		return (
			<>
				<h1 className='fs-1 mt-4 mb-5'>Замовлення користувача</h1>
				<div className='d-flex justify-content-center align-items-center text-muted notOrders'>
					<div>
						У вас поки немає замовлень
						<Image
							className='ms-1 opacity-75'
							src={process.env.NEXT_PUBLIC_API_URL + 'pngegg.png'}
							alt='icon'
							width={40}
							height={40}
						/>
					</div>
				</div>
			</>
		)
	}

	return (
		<>
			<h1 className='fs-1 mt-4 mb-5'>Замовлення користувача</h1>
			<div style={{ minHeight: '60vh' }}>
				<div
					style={{
						fontSize: '22px',
						marginBottom: '80px',
					}}
				>
					<main>
						{order.type === 'orders' &&
							order.orders.map((orderData, index) => (
								<Row
									key={orderData._id}
									className='d-flex align-items-center justify-content-center flex-wrap orderData-product'
								>
									<Row
										style={{
											padding: '20px 0px 0px 0px',
										}}
									>
										{orderData.orderNumber && (
											<h3> Номер замовлення {orderData.orderNumber}</h3>
										)}
										{orderData.products.map(product => (
											<Row
												key={product._id}
												className='d-flex flex-row flex-nowrap p-0 align-items-center m-auto my-3'
											>
												<Col
													xs={6}
													sm={4}
													xl={3}
													onClick={() => {
														router.push('/product/' + product.name)
													}}
												>
													<Image
														className={`order-product-img ${
															orderData.isCancel && 'cancelOrder'
														}`}
														alt='image_order_icon'
														src={
															product.selectedColor !== undefined
																? product.colors.find(
																		value =>
																			value.color === product.selectedColor
																  )!.urlImg
																: product.img[0]
														}
														width={350}
														height={350}
													/>
												</Col>
												<Col xs={6} sm={7} xl={8}>
													<Row className='d-flex flex-xl-row fw-semibold flex-column order-product-info'>
														<Col xl={4}>
															<div>
																{product.name +
																	' (' +
																	product.selectedColor +
																	')'}
															</div>
															<div className='d-flex flex-row'>
																{checkRating(product.totalRating)}
																<span className='text-muted'>{`(${product.countRating})`}</span>
															</div>
														</Col>
														<Col
															xl={4}
															className='d-flex justify-content-xl-end'
														>
															<div className='ms-1'>
																{product.count + ' шт.'}
															</div>
														</Col>
														<Col xl={4} className='text-xl-end'>
															<div>{product.price + ' грн'}</div>
														</Col>
													</Row>
												</Col>
											</Row>
										))}
									</Row>
									<Row
										className='d-flex justify-content-between container-order-product-status'
										key={orderData._id}
									>
										{orderData.info && (
											<Col xs={12} className='px-0 d-flex flex-row oder-info'>
												<p>
													Інформація про замовлення:{' '}
													<span className='text-muted'>
														{orderData.info[orderData.info.length - 1]}
													</span>
												</p>
											</Col>
										)}
										<Col xs={6} md='5' className='p-0'>
											{orderData.TTN && (
												<div className='show-status-order'>
													Номер накладної: {orderData.TTN}
												</div>
											)}
											<span className='show-status-order'>Статус товару:</span>
											{orderData.isCancel === true ? (
												<Row>
													<Col
														xs={1}
														className='d-flex justify-content-center align-items-start'
													>
														<Image
															className='mt-1'
															alt='image_success'
															width={20}
															height={20}
															src={
																process.env.NEXT_PUBLIC_API_URL +
																'checkSuccess.png'
															}
														/>
													</Col>
													<Col className='px-0'>{'Скасовано'}</Col>
												</Row>
											) : (
												orderData.status && (
													<Row className='py-1 ms-1 status-container'>
														{orderData.status.map((value, index) => {
															if (index <= 2) {
																return (
																	<Row
																		key={index}
																		className={
																			index === 0 ? '' : 'status-item-old'
																		}
																	>
																		<Col
																			xs={1}
																			className='d-flex justify-content-center align-items-start'
																		>
																			<Image
																				className='mt-1'
																				alt='image_success'
																				width={20}
																				height={20}
																				src={
																					process.env.NEXT_PUBLIC_API_URL +
																					'checkSuccess.png'
																				}
																			/>
																		</Col>
																		<Col className='px-0'>{value}</Col>
																	</Row>
																)
															} else {
																return
															}
														})}
														<div className='status-item status-item-hide'>
															{orderData.status.map((value, index) => {
																if (index <= 2) {
																	return
																} else {
																	return (
																		<Row
																			key={index}
																			className={'status-item-old'}
																		>
																			<Col
																				xs={1}
																				className='d-flex justify-content-center align-items-start'
																			>
																				<Image
																					className='mt-1'
																					alt='image_success'
																					width={20}
																					height={20}
																					src={
																						process.env.NEXT_PUBLIC_API_URL +
																						'checkSuccess.png'
																					}
																				/>
																			</Col>
																			<Col className='px-0'>{value}</Col>
																		</Row>
																	)
																}
															})}
														</div>
														<div
															onClick={handleDropdownStatus}
															className='container-showHistory'
														>
															<Image
																className='img-showHistory'
																alt='image_show_history'
																width={20}
																height={20}
																src={
																	process.env.NEXT_PUBLIC_API_URL +
																	'arrow-down-sign-to-navigate.png'
																}
															/>
														</div>
													</Row>
												)
											)}
										</Col>
										<Col
											xs={6}
											md='6'
											className='text-end container-track-info'
										>
											<div className='mt-2'>
												{`Очікувана дата доставки: ${orderData.resultStatus.deliveryData}`}
											</div>
											<div className='mt-2'>
												{`Повна вартість замовлення: ${
													orderData.price + +orderData.resultStatus.deliveryCost
												} грн.`}
											</div>
											<div className='mt-2'>
												{`${orderData.resultStatus.warehouseRecipient}`}
											</div>
											<Button
												size={'lg'}
												disabled={orderData.isCancel || false}
												variant='outline-dark'
												onMouseDown={async () => {
													if (isFetching) {
														return false
													}
													setIsFetching(true)
													try {
														const response = await cancelOrder(
															orderData.TTN,
															orderData.orderNumber
														)
														if (response === 'ok') {
															setFetchCancelOrder(response + Math.random())
														}
													} catch (e) {
														createEventBlueError(
															'Помилка виконання',
															'Виникла помилка при скасуванні замовлення'
														)
													} finally {
														setIsFetching(false)
													}
												}}
											>
												{orderData.isCancel ? 'Скасовано' : 'Скасувати'}
											</Button>
										</Col>
									</Row>
								</Row>
							))}
					</main>
				</div>
			</div>
		</>
	)
}

export default Order

'use client'
import React, { FC, useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { ICommentComponent } from '@/types/IComments'
import Image from 'next/image'
import { getAllComments } from '@/services/commentAPI'
import { checkRating } from './ratingUtils'

const CommentsComponent: FC<ICommentComponent> = props => {
	const [loadComment, setLoadComments] = useState<boolean>(true)
	const [toggleShowResponseComments, setToggleShowResponseComments] = useState<
		boolean[]
	>([])

	useEffect(() => {
		;(async () => {
			const comments = await getAllComments(props.productId)
			props.setComments(comments)
			setLoadComments(false)
		})()
	}, [])

	return (
		<>
			<Row className='m-auto'>
				<Col md={6} xs={12} className='d-flex justify-content-between'>
					<Row>
						<Col xs={12} sm={6} md={6}>
							<p className='info-count-comments'>
								Відгуки покупців {`(${props.comments.length})`}
							</p>
						</Col>
						<Col xs={12} sm={6} md={6}>
							<Button
								className='container-button btn-create-comment'
								variant='dark'
								size='lg'
								onClick={() => props.setShowModal(true)}
							>
								Залишити відгук
							</Button>
						</Col>
					</Row>
				</Col>
			</Row>
			{loadComment ? (
				'завантаження відгуків та коментарів'
			) : !props.comments.length ? (
				<Row className='mb-4 mx-auto fs-4'>
					<Col md={6} xs={12}>
						<h5 className='info-empty-comments'>
							відгуків чи коментарів тут немає :(
						</h5>
					</Col>
				</Row>
			) : (
				props.comments.map((comment, index) => (
					<React.Fragment key={comment._id}>
						<Row as='article' role='article' className='m-auto my-4'>
							<Col md={6} xs={12} className='body-userData-view'>
								<Row>
									<Col
										as='header'
										role='rowheader'
										xs={6}
										className='userData-view'
									>
										<Image
											width={25}
											height={25}
											alt='image_account_icon'
											className='me-2'
											src={process.env.NEXT_PUBLIC_API_URL + 'account.png'}
										/>
										{comment.username}
									</Col>
									<Col xs={6} className='d-flex justify-content-end'>
										{comment.commentDate}
										{props.userId == comment.userId ? (
											comment.isRemove ? (
												''
											) : (
												<span>
													<span className='ms-2'>
														<Image
															width={25}
															height={25}
															onClick={() => {
																props.setChangeCommentData(comment.commentData)
																props.setCommentUserId(comment._id)
																props.setShowModalChangeComment(true)
																props.setShowResponseToggle(false)
															}}
															alt='image_edit_icon'
															src={process.env.NEXT_PUBLIC_API_URL + 'edit.png'}
														/>
													</span>
													<span className='ms-2'>
														<Image
															width={25}
															height={25}
															alt='icon-close'
															onClick={() => {
																props.setCommentUserId(comment._id)
																props.setToggleShowRemoveComment(true)
																props.setShowResponseToggle(false)
															}}
															src={
																process.env.NEXT_PUBLIC_API_URL +
																'icons8-close-24.png'
															}
														/>
													</span>
												</span>
											)
										) : (
											''
										)}
									</Col>
								</Row>
								<Row>
									<Col xs={1}>
										{comment.isGetOrder && (
											<Image
												width={25}
												height={25}
												alt='image_but_parchase_icon'
												src={
													process.env.NEXT_PUBLIC_API_URL + 'buyPurchase.png'
												}
											/>
										)}
									</Col>
									<Col
										xs={5}
										style={{
											fontWeight: '600',
										}}
										className='text-muted'
									>
										{comment.isGetOrder && 'Купив товар'}
									</Col>
									<Col
										xs={6}
										className='d-flex align-items-center justify-content-end'
									>
										{comment.isGetOrder && comment.rating !== 0
											? checkRating(comment.rating)
											: null
										}
									</Col>
								</Row>
								<hr />
								<Row>
									<Col
										xs={12}
										style={
											comment.isRemove
												? {
														fontStyle: 'italic',
														color: 'rgb(143,143,143)',
												  }
												: {
														wordWrap: 'break-word',
														wordBreak: 'break-all',
												  }
										}
									>
										{comment.commentData}
										{comment.isChanged && !comment.isRemove ? (
											<Row
												style={{
													fontSize: '14px',
													fontStyle: 'italic',
													color: 'rgb(143, 143, 143)',
												}}
												className='d-flex text-end py-0 my-0'
											>
												<Col>
													<span>
														змінено
														<Image
															className='ms-1'
															alt='icon-edit'
															width={15}
															height={15}
															src={
																process.env.NEXT_PUBLIC_API_URL + 'edited.png'
															}
														/>
													</span>
												</Col>
											</Row>
										) : (
											''
										)}
									</Col>
								</Row>
								<hr
									style={
										comment.isChanged && !comment.isRemove
											? {
													marginTop: '2px',
											  }
											: {}
									}
								/>
								<Row className='comment-panel'>
									<Col xs={6} className='text-center p-0'>
										<div
											onClick={() => {
												props.setShowModalResponse(true)
												props.setCommentUserId(comment._id)
												props.setMainCommentUserId(comment._id)
											}}
											className='d-flex justify-content-center'
											style={{ cursor: 'pointer' }}
										>
											<Image
												width={30}
												height={30}
												alt='image_write_icon'
												src={process.env.NEXT_PUBLIC_API_URL + 'write.png'}
											/>
											відповісти
										</div>
									</Col>
									<Col
										xs={6}
										className='text-center p-0'
										onClick={() => {
											setToggleShowResponseComments(prevState => {
												const newState = [...prevState]
												newState[index] = !newState[index]
												return newState
											})
										}}
									>
										<span style={{ cursor: 'pointer' }}>
											<Image
												width={30}
												height={30}
												className='me-1'
												alt='image_responsive_icon'
												src={
													process.env.NEXT_PUBLIC_API_URL + 'responsiveness.png'
												}
											/>
											відповіді
											<span
												className='ms-1 text-muted'
												style={{
													fontWeight: '600',
												}}
											>
												{comment.responseComments.length
													? `(${comment.responseComments.length})`
													: ''}
											</span>
										</span>
									</Col>
								</Row>
							</Col>
						</Row>
						{comment.responseComments.map((responseComment, dIndex) => {
							return (
								<React.Fragment key={responseComment._id}>
									{dIndex === 0 && toggleShowResponseComments[index] ? (
										<Row>
											<Col md={6} sm={10} xs={12}>
												<h3 className='response-toCommentUser'>{`Відповіді користувачу ${comment.username}:`}</h3>
											</Col>
										</Row>
									) : (
										''
									)}
									<Row
										as='article'
										role='article'
										className='m-auto my-3'
										key={dIndex}
										style={{
											display: toggleShowResponseComments[index]
												? 'block'
												: 'none',
										}}
									>
										<Col md={6} sm={10} xs={12}>
											<Row>
												<Col xs={1} className='d-flex justify-content-around'>
													<div
														style={{
															width: '2%',
															margin: '50% auto',
															height: '80%',
															backgroundColor: '#d5d5d5',
														}}
													/>
												</Col>
												<Col
													xs={11}
													style={{
														border: '1px solid rgb(209 209 209)',
														borderRadius: '7px',
														fontSize: '20px',
														padding: '7px 20px',
													}}
												>
													<Row>
														<Col
															as='header'
															role='rowheader'
															xs={6}
															className='response-commentUsername'
														>
															<Image
																width={25}
																height={25}
																alt='image_account_icon'
																className='me-2'
																src={
																	process.env.NEXT_PUBLIC_API_URL +
																	'account.png'
																}
															/>
															<p className='mb-0'>{responseComment.username}</p>
														</Col>
														<Col
															xs={6}
															className='d-flex justify-content-end mt-1 response-commentDate'
														>
															{responseComment.commentDate}
															{props.userId == responseComment.userId ? (
																responseComment.isRemove ? (
																	''
																) : (
																	<span>
																		<span className='ms-2'>
																			<Image
																				width={25}
																				height={25}
																				onClick={() => {
																					props.setChangeCommentData(
																						responseComment.commentData
																					)
																					props.setSelectComUId(
																						responseComment._id
																					)
																					props.setCommentUserId(comment._id)
																					props.setShowResponseToggle(true)
																					props.setShowModalChangeComment(true)
																				}}
																				alt='image_edit_icon'
																				src={
																					process.env.NEXT_PUBLIC_API_URL +
																					'edit.png'
																				}
																			/>
																		</span>
																		<span className='ms-2'>
																			<Image
																				width={25}
																				height={25}
																				onClick={() => {
																					props.setCommentUserId(comment._id)
																					props.setSelectComUId(
																						responseComment._id
																					)
																					props.setToggleShowRemoveComment(true)
																					props.setShowResponseToggle(true)
																				}}
																				alt='image_close_icon'
																				src={
																					process.env.NEXT_PUBLIC_API_URL +
																					'icons8-close-24.png'
																				}
																			/>
																		</span>
																	</span>
																)
															) : (
																''
															)}
														</Col>
													</Row>
													<Row>
														<Col xs={1}>
															{responseComment.isGetOrder && (
																<Image
																	width={25}
																	alt='icon-purchase'
																	height={25}
																	src={
																		process.env.NEXT_PUBLIC_API_URL +
																		'buyPurchase.png'
																	}
																/>
															)}
														</Col>
														<Col
															xs={5}
															style={{
																fontWeight: '600',
															}}
															className='text-muted'
														>
															{responseComment.isGetOrder && 'Купив товар'}
														</Col>
													</Row>
													<hr className='my-1' />
													<Row>
														<Col className='d-flex align-items-center'>
															<Image
																src={
																	process.env.NEXT_PUBLIC_API_URL +
																	'turn-right.png'
																}
																alt='icon-turn-right'
																width={23}
																height={23}
															/>
															<p className='response-sentTo text-muted mb-0'>
																відповідь користувачу {responseComment.sendTo}
															</p>
														</Col>
													</Row>
													<hr className='mt-1' />
													<Row>
														<Col
															xs={12}
															className='response-commentData'
															style={
																responseComment.isRemove
																	? {
																			fontStyle: 'italic',
																			color: 'rgb(143,143,143)',
																	  }
																	: {
																			wordWrap: 'break-word',
																			wordBreak: 'break-all',
																	  }
															}
														>
															{responseComment.commentData}
															{responseComment.isChanged &&
															!responseComment.isRemove ? (
																<Row
																	style={{
																		fontSize: '14px',
																		fontStyle: 'italic',
																		color: 'rgb(143, 143, 143)',
																	}}
																	className='d-flex text-end py-0 my-0'
																>
																	<Col>
																		<span>
																			змінено
																			<Image
																				className='ms-1'
																				alt='icon-edit'
																				width={15}
																				height={15}
																				src={
																					process.env.NEXT_PUBLIC_API_URL +
																					'edited.png'
																				}
																			/>
																		</span>
																	</Col>
																</Row>
															) : (
																''
															)}
														</Col>
													</Row>
													<hr />
													<Row>
														<Col
															xs={12}
															className='text-center button-response-to-response'
														>
															<div
																onClick={() => {
																	props.setShowModalResponse(true)
																	props.setCommentUserId(responseComment._id)
																	props.setMainCommentUserId(comment._id)
																}}
																className='d-flex justify-content-center'
															>
																<Image
																	width={30}
																	height={30}
																	alt='icon-write'
																	src={
																		process.env.NEXT_PUBLIC_API_URL +
																		'write.png'
																	}
																/>
																відповісти
															</div>
														</Col>
													</Row>
												</Col>
											</Row>
										</Col>
									</Row>
								</React.Fragment>
							)
						})}
					</React.Fragment>
				))
			)}
		</>
	)
}

export default CommentsComponent

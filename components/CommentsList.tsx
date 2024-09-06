'use client'
import { getUserComments } from '@/services/commentAPI'
import '@/styles/Comment.css'
import { IGetAllComments, IUserComments } from '@/types/IComments'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { FC, useEffect, useState } from 'react'
import { Accordion, Col, Row } from 'react-bootstrap'
import LoadSpinner from './LoadSpinner'
import { checkRating } from './ratingUtils'

const CommentsList: FC = () => {
	const [comments, setComments] = useState<IUserComments[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)

	const router = useRouter()

	useEffect(() => {
		;(async () => {
			const response = await getUserComments()

			setComments(response as IUserComments[])
			setIsLoading(false)
		})()
	}, [])

	if (isLoading) {
		return <LoadSpinner />
	}

	if (comments.length === 0) {
		return (
			<>
				<h1 className='fs-1 mt-4 mb-5'>Коментарі користувача</h1>
				<div className='d-flex justify-content-center align-items-center text-muted noСomments'>
					<div>
						У вас поки немає коментарів
						<Image
							className='ms-1 opacity-75'
							src={process.env.NEXT_PUBLIC_API_URL + 'pngegg.png'}
							width={40}
							height={40}
							alt='icon'
						/>
					</div>
				</div>
			</>
		)
	}

	const createCommentComponent = (
		userComment: IGetAllComments,
		index: number
	) => {
		return (
			<React.Fragment key={index}>
				<Row as='aside' role='aside'>
					<Col
						style={{
							fontSize: '20px',
							padding: '7px 20px',
						}}
					>
						<Row>
							<Col xs={5} className='comment-username'>
								{userComment.username}
							</Col>
							<Col
								xs={7}
								className='d-flex justify-content-start comment-commentDate'
							>
								{userComment.commentDate}
							</Col>
						</Row>
						<Row>
							<Col
								xs={6}
								className='d-flex align-items-center justify-content-end'
							>
								{userComment.isGetOrder && userComment.rating !== 0
									? checkRating(userComment.rating)
									: ''}
							</Col>
						</Row>
						<hr />
						<Row>
							<Col
								xs={12}
								className='commentData'
								style={
									userComment.isRemove
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
								{userComment.commentData}
								{userComment.isChanged && !userComment.isRemove ? (
									<Row
										style={{
											fontSize: '14px',
											fontStyle: 'italic',
											color: 'rgb(143, 143, 143)',
										}}
										className='d-flex text-end text-lg-center py-0 my-0'
									>
										<Col>
											<span>
												змінено
												<Image
													className='ms-1'
													alt='image_edit_icon'
													width={15}
													height={15}
													src={process.env.NEXT_PUBLIC_API_URL + 'edited.png'}
												/>
											</span>
										</Col>
									</Row>
								) : (
									''
								)}
							</Col>
						</Row>
					</Col>
				</Row>
				<div
					style={{
						marginTop: '20px',
						marginBottom: '12px',
						height: '3px',
						backgroundColor: 'rgb(216 216 216 / 78%)',
						borderRadius: '5px',
						minWidth: '100%',
					}}
				></div>
			</React.Fragment>
		)
	}

	return (
		<>
			<h1 className='fs-1 mt-4 mb-5'>Коментарі користувача</h1>
			<main>
				<div style={{ minHeight: '60vh' }}>
					<div className='mx-sm-5'>
						{comments.map((comment, index) => (
							<Accordion key={comment._id}>
								<Accordion.Item className='my-4' eventKey={index.toString()}>
									<React.Fragment>
										<Accordion.Header>
											<Row
												className='d-flex flex-nowrap justify-content-around p-1'
												style={{ width: 'inherit' }}
											>
												<Col
													xs={5}
													sm={4}
													className='d-flex justify-content-center align-items-center'
												>
													<Image
														className='comment-productImg'
														style={{ borderRadius: '14px', cursor: 'pointer' }}
														alt='image_product'
														src={comment.productImg[0]}
														width={200}
														height={200}
														onClick={() => {
															router.push('/product/' + comment.productName)
														}}
													/>
												</Col>
												<Col
													xs={7}
													sm={5}
													className='d-flex flex-column ms-2 ms-sm-1 ms-lg-0'
												>
													<p
														onClick={() => {
															router.push('/product/' + comment.productName)
														}}
														className='comment-productName'
													>
														{comment.productName}
													</p>
													<p className='comment-productDesc text-muted'>
														{comment.productShortDescription}
													</p>
													<p className='d-flex my-1'>
														{checkRating(comment.productTotalRating)}
														<span className='text-muted ms-1'>
															{`(${comment.productCountRating})`}
														</span>
													</p>
												</Col>
												<Col sm={3} className='comment-showList'>
													<p>показати/приховати</p>
												</Col>
											</Row>
										</Accordion.Header>
										<Accordion.Body>
											{comment.userComments.map((userComment, index) =>
												createCommentComponent(userComment, index)
											)}
										</Accordion.Body>
									</React.Fragment>
								</Accordion.Item>
							</Accordion>
						))}
					</div>
				</div>
			</main>
		</>
	)
}

export default CommentsList

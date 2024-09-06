'use client'
import React, { useEffect, useState, FC } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { createCommentUser, getAllComments } from '@/services/commentAPI'
import { createDate } from '@/utils/commentUtils'
import { useSession } from 'next-auth/react'
import { checkOrderProduct } from '@/services/productAPI'
import { ICreateComment } from '@/types/IComments'
import { createEventBlueError } from '@/utils/serviceUtils'
import SelectRatingStar from './SelectRatingStar'

const CreateComment: FC<ICreateComment> = ({
	show,
	onHide,
	productId,
	setCommentsProduct,
}) => {
	const session = useSession()
	const [textValue, setTextValue] = useState<string>('')
	const [rating, setRating] = useState<number>(0)
	const [isFetching, setIsFetching] = useState<boolean>(false)
	const [infoOrder, setInfoOrder] = useState({
		isGetProduct: false,
		isSetRating: false,
	})

	useEffect(() => {
		if (session.status === 'authenticated') {
			;(async () => {
				const response = await checkOrderProduct(productId)
				setInfoOrder(response.message)
			})()
		}
	}, [])

	const fetchComment = async () => {
		if (isFetching) {
			onHide(false)
			return
		}
		setIsFetching(true)

		try {
			const response = await createCommentUser(
				productId,
				rating,
				textValue,
				createDate()
			)
			if (response === 'не авторизован') {
				createEventBlueError(
					'Помилка відправлення',
					'Термін вашої авторизації минув, оновіть сторінку та авторизуйтесь для повторного надсилання повідомлення'
				)
			}
			const comments = await getAllComments(productId)
			setCommentsProduct(comments)

			onHide(false)
			setRating(0)

			if (response.error) {
				createEventBlueError(response.error.title, response.error.data)
			}
		} catch (error: any) {
			console.log("сталася помилка")
		} finally {
			setTextValue('')
			setIsFetching(false)
		}
	}

	return (
		<Modal
			centered={true}
			size='lg'
			show={show}
			onHide={onHide}
			animation={true}
		>
			<Modal.Header closeButton>
				<Modal.Title id='contained-modal-title-vcenter'>
					{infoOrder.isGetProduct ? 'Створення відгуку' : 'Створення коментаря'}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					{infoOrder.isGetProduct && !infoOrder.isSetRating ? (
						<Form.Group>
							<Form.Label className='fs-4 text-muted'>
								Вкажіть на скільки ви оцінюєте товар:
							</Form.Label>
							<div className='d-flex justify-content-center my-3'>
								<SelectRatingStar handlerRating={setRating} />
							</div>
						</Form.Group>
					) : (
						''
					)}
					<Form.Group>
						<Form.Label className='fs-4 text-muted'>
							{infoOrder.isGetProduct
								? 'Поле для відгуку:'
								: 'Поле для коментаря'}
						</Form.Label>
						<Form.Control
							as='textarea'
							size='lg'
							value={textValue}
							onChange={e => {
								if (textValue.length > 200) {
									return false
								}
								setTextValue(e.target.value)
							}}
							onKeyDown={async e => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault()
									await fetchComment()
								}
							}}
						/>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='dark' size='lg' onClick={fetchComment}>
					{isFetching ? 'Йде відправка...' : 'Підтвердити'}
				</Button>
				<Button
					className='ms-3'
					variant='outline-secondary'
					size='lg'
					onClick={e => onHide()}
				>
					Скасувати
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default CreateComment

'use client'
import React, { useEffect, useState, FC } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import {
	changeCommentUser,
	changeResponseCommentUser,
	getAllComments,
} from '@/services/commentAPI'
import { IChangeComment } from '@/types/IComments'
import { createEventBlueError } from '@/utils/serviceUtils'

const ChangeComment: FC<IChangeComment> = ({
	show,
	showChangeResponse,
	onHide,
	productId,
	commentUserId,
	changeCommentData,
	responseCommentUserId,
	setCommentsProduct,
}) => {
	const [textValue, setTextValue] = useState<string>('')
	const [isFetching, setIsFetching] = useState<boolean>(false)

	useEffect(() => {
		setTextValue(changeCommentData)
	}, [show])

	const fetchChangeComment = async () => {
		if (isFetching) {
			onHide()
			return
		}
		setIsFetching(true)
		try {
			if (show === true && !showChangeResponse) {
				const response = await changeCommentUser(
					productId,
					commentUserId,
					textValue
				)

				if (response === 'не авторизован') {
					createEventBlueError('Помилка відправлення', 'Термін вашої авторизації минув, оновіть сторінку та авторизуйтесь для повторного надсилання повідомлення')

					onHide()
					setIsFetching(false)
					return
				}

				const comments = await getAllComments(productId)
				setCommentsProduct(comments)
				onHide()

				if (response.error) {
					createEventBlueError(response.error.title, response.error.data)
				}
			}
			if (showChangeResponse === true) {
				const response = await changeResponseCommentUser(
					responseCommentUserId,
					productId,
					commentUserId,
					textValue
				)

				const comments = await getAllComments(productId)
				setCommentsProduct(comments)

				if (response === 'не авторизован') {
					createEventBlueError('Помилка відправлення', 'Термін вашої авторизації минув, оновіть сторінку та авторизуйтесь для повторного надсилання повідомлення')
				}

				onHide()

				if (response.error) {
					createEventBlueError(response.error.title, response.error.data)
				}
			}
		} catch (error: any) {
			createEventBlueError(error.error.title, error.error.data)
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
					Зміна відгуку
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group>
						<Form.Label className='fs-4 text-muted'>
							Поле для зміни відгуку:
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
									await fetchChangeComment()
								}
							}}
						/>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='dark' size='lg' onClick={fetchChangeComment}>
					{isFetching ? 'Йде відправка...' : 'Підтвердити'}
				</Button>
				<Button
					className='ms-3'
					variant='outline-secondary'
					size='lg'
					onClick={onHide}
				>
					Скасувати
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default ChangeComment

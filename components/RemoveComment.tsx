'use client'
import { IRemoveComment } from '@/types/IComments'
import { createDate } from '@/utils/commentUtils'
import { createEventBlueError, createEventRedError } from '@/utils/serviceUtils'
import { FC, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import {
	getAllComments,
	removeComment,
	removeResponseComment,
} from '../services/commentAPI'

const RemoveComment: FC<IRemoveComment> = ({
	show,
	showRemoveResponse,
	onHide,
	responseCommentUserId,
	productId,
	commentUserId,
	setCommentsProduct,
}) => {
	const [isFetching, setIsFetching] = useState<boolean>(false)

	const fetchRemoveComment = async () => {
		if (isFetching) {
			onHide()
			return
		}
		setIsFetching(true)

		try {
			if (show === true && !showRemoveResponse) {
				const response = await removeComment(
					productId,
					commentUserId,
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

				onHide()

				if (response.error) {
					createEventRedError(response.error.title, response.error.data)
				}
			}
			if (showRemoveResponse === true) {
				const response = await removeResponseComment(
					productId,
					responseCommentUserId,
					commentUserId
				)
				const resComments = await getAllComments(productId)
				setCommentsProduct(resComments)

				if (response === 'не авторизован') {
					createEventBlueError(
						'Помилка відправлення',
						'Термін вашої авторизації минув, оновіть сторінку та авторизуйтесь для повторного надсилання повідомлення'
					)
				}

				onHide()

				if (response.error) {
					createEventRedError(response.error.title, response.error.data)
				}
			}
		} catch (e: any) {
			createEventRedError('Сталася непередбачена помилка', 'Спробуйте пізніше')
		} finally {
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
					Ви дійсно хочете видалити коментар?
				</Modal.Title>
			</Modal.Header>
			<Modal.Footer>
				<Button variant='dark' size='lg' onClick={fetchRemoveComment}>
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

export default RemoveComment

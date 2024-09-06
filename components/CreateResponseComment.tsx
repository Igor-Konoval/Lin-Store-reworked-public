import { ICreateResponseComment } from '@/types/IComments'
import { createDate } from '@/utils/commentUtils'
import { createEventBlueError } from '@/utils/serviceUtils'
import { FC, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import {
	createResponseCommentUser,
	getAllComments,
} from '../services/commentAPI'

const CreateResponseComment: FC<ICreateResponseComment> = ({
	show,
	onHide,
	productId,
	commentUserId,
	mainCommentUserId,
	setCommentsProduct,
}) => {
	const [textValue, setTextValue] = useState<string>('')
	const [isFetching, setIsFetching] = useState<boolean>(false)

	const fetchResponseComment = async () => {
		if (isFetching) {
			onHide()
			return
		}
		setIsFetching(true)

		try {
			const response = await createResponseCommentUser(
				productId,
				commentUserId,
				mainCommentUserId,
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

			onHide()

			if (response.error) {
				createEventBlueError(response.error.title, response.error.data)
			}
		} catch (e: any) {
			console.log(e.message)
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
					Створення відповіді користувачу
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group>
						<Form.Label className='fs-4 text-muted'>
							Поле для відповіді:
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
									await fetchResponseComment()
								}
							}}
						/>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='dark' size='lg' onClick={fetchResponseComment}>
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

export default CreateResponseComment

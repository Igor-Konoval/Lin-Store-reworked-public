import { createType } from '@/services/adminAPI'
import { type IAdminModal } from '@/types/IAdmin'
import React, { FC, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

const CreateType: FC<IAdminModal> = ({ show, onHide }) => {
	const [type, setType] = useState<string>('')
	const addType = async () => {
		const data = {
			name: type,
		}
		await createType(data).then(data => {
			onHide()
		})
	}
	return (
		<Modal
			show={show}
			onHide={onHide}
			size='lg'
			aria-labelledby='contained-modal-title-vcenter'
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id='contained-modal-title-vcenter'>
					Добавить тип: смартфоны, часы...
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group className='mb-3'>
						<Form.Label>Поле для добавления нового типа</Form.Label>
						<Form.Control
							onChange={e => setType(e.target.value)}
							placeholder='подшипники, наушники...'
						></Form.Control>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={onHide}>Закрыть</Button>
				<Button onClick={addType}>Добавить</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default CreateType

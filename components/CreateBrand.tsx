import { createBrand } from '@/services/adminAPI'
import { type IAdminModal } from '@/types/IAdmin'
import React, { FC, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

const CreateBrand: FC<IAdminModal> = ({ show, onHide }) => {
	const [brand, setBrand] = useState<string>('')
	const addBrand = async () => {
		const data = {
			name: brand,
		}

		await createBrand(data).then(data => {
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
				<Modal.Title id='contained-modal-title-vcenter' />
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group className='mb-3'>
						<Form.Label>Поле для додавання нового бренду</Form.Label>
						<Form.Control
							onChange={e => setBrand(e.target.value)}
							placeholder='sony, xiaomi...'
						></Form.Control>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={onHide}>Закрити</Button>
				<Button onClick={addBrand}>Додати</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default CreateBrand

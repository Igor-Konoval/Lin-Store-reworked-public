import '@/styles/AlertCreateOrder.css'
import { FC } from 'react'
import { Col, Row } from 'react-bootstrap'

const AlertCreateOrder: FC = () => {
	return (
		<div className={'alert-container'}>
			<Row className={'alert-body'}>
				<Col className='d-flex justify-content-center align-items-center flex-column'>
					<div className={'container-success-mark'}>
						<div className={'success-mark'}>
							<div></div>
							<div></div>
						</div>
					</div>
					<h3>Замовлення прийняте</h3>
					<p>Перейдіть на вкладку "Ваші замовлення" для відстеження статусу</p>
				</Col>
			</Row>
		</div>
	)
}

export default AlertCreateOrder

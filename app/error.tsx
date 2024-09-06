'use client'
import { Col, Row } from 'react-bootstrap'

const Error = () => {
	setTimeout(() => {
		window.location.reload()
	}, 2000)
	return (
		<Row>
			<Col style={{ minHeight: '70vh' }}>
				<div className='d-flex flex-column justify-content-center align-items-center pt-5'>
					<div style={{ fontSize: '26px', fontWeight: 'bold' }}>
						Oops! Сталася непередбачувана помилка.
					</div>
					<p style={{ margin: '10px 0', fontSize: '22px' }}>
						Через секунду сторінку буде перезавантажено.
					</p>
				</div>
			</Col>
		</Row>
	)
}

export default Error

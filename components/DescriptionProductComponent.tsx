'use client'
import React, { FC } from 'react'
import { Accordion, Col, Row } from 'react-bootstrap'
import { IDescription } from '@/types/IProduct'

const DescriptionProductComponent: FC<{
	description: IDescription[]
}> = ({ description }) => {
	return (
		<Row className='mt-3 mb-5 mx-auto d-flex'>
			<Col md={6} xs={12}>
				<Accordion
					style={{
						border: '1px solid #dee2e6',
						borderRadius: '8px',
						backgroundColor: '#f8f9fa',
						fontSize: '18px',
						fontFamily: 'Arial, sans-serif',
						overflow: 'hidden',
						boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
					}}
				>
					<Accordion.Item eventKey='0'>
						<Accordion.Header>
							<Row
								as='h3'
								role='h3'
								style={{
									color: '#494949',
									fontSize: '24px',
									fontWeight: 'bold',
									padding: '10px 20px',
									wordWrap: 'break-word',
									wordBreak: 'break-all',
								}}
							>
								Характеристики товару
							</Row>
						</Accordion.Header>
						<Accordion.Body className='p-0'>
							{description.map((info, index) => (
								<Row
									key={index}
									style={{
										backgroundColor: index % 2 === 0 ? '#f1f1f1' : '#f8f9fa',
										padding: '10px 20px',
										borderBottom: '1px solid #dee2e6',
										margin: 'auto',
									}}
								>
									<Col
										xs={6}
										as='h2'
										role='h2'
										className='product-characteristic'
									>
										{info.title}
									</Col>
									<Col
										xs={6}
										as='h2'
										role='h2'
										className='product-characteristic'
									>
										{info.description}
									</Col>
								</Row>
							))}
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</Col>
		</Row>
	)
}

export default DescriptionProductComponent

'use client'
import React, { useEffect, useState, FC } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import { IErrorMessage } from '@/types/IService'

const AlertError: FC = () => {
	const [showAlertDis, setShowAlertDis] = useState(false)
	const [errorMessage, setErrorMessage] = useState<IErrorMessage>({
		errorTitle: '',
		errorData: '',
	})

	function eventHandler(e: Event) {
		const customEvent = e as CustomEvent<IErrorMessage>
		setErrorMessage({
			errorTitle: customEvent.detail.errorTitle,
			errorData: customEvent.detail.errorData,
		})
		setShowAlertDis(true)
	}

	useEffect(() => {
		document.addEventListener('alertRedError', eventHandler)
	}, [])

	return (
		<Alert
			show={showAlertDis}
			variant='danger'
			style={{
				backgroundColor: 'rgb(255 255 255)',
				position: 'fixed',
				bottom: '32%',
				left: '50%',
				transform: 'translateX(-50%)',
				width: '45%',
				borderRadius: '10px',
				zIndex: '100000',
				boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
			}}
		>
			<div style={{ fontSize: '22px', fontWeight: 'bold' }}>
				Oops! {errorMessage.errorTitle}
			</div>
			<p style={{ margin: '10px 0', fontSize: '20px' }}>
				{errorMessage.errorData}
			</p>
			<hr />
			<div className='d-flex justify-content-end'>
				<Button onClick={() => setShowAlertDis(false)} variant='danger'>
					Зрозумів, дякую!
				</Button>
			</div>
		</Alert>
	)
}

export default AlertError

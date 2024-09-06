'use client'
import { Button } from 'react-bootstrap'
import '@/styles/AlertPrivacyPolicy.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const AlertPrivacyPolicy = () => {
	const [showAlert, setShowAlert] = useState(false)

	useEffect(() => {
		if (localStorage.getItem('acceptPrivacy') === 'accepted') {
			setShowAlert(false)
		} else {
			setShowAlert(true)
		}
	})
	return (
		showAlert && (
			<div className='container-privacy'>
				<div className='block-privacy'>
					<div className='privacy-content'>
						Цей сайт використовує куки та інші технології для покращення досвіду
						вашого користування. Продовжуючи перегляд сайту, ви погоджуєтеся з
						нашою{' '}
						<Link id='privacy-link' href={'/policy'}>
							політикою конфіденційності
						</Link>
						. У разі неприйняття умов закрийте сайт.
					</div>
					<div id='container-privacy-accept'>
						<Button
							variant='outline-secondary'
							id='privacy-accept-btn'
							onMouseDown={() => {
								localStorage.setItem('acceptPrivacy', 'accepted')
								setShowAlert(false)
							}}
						>
							прийняти
						</Button>
					</div>
				</div>
			</div>
		)
	)
}

export default AlertPrivacyPolicy

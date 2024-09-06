'use client'
import React, { FC, useEffect, useState } from 'react'
import '@/styles/RecoveryPassword.css'
import '@/styles/Auth.css'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { checkRecoveryLink, fetchRecoveryPassword } from '@/services/userAPI'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { LOGIN_ROUTE } from '@/consts/links'

const RecoveryPassword: FC<{ link: string }> = ({ link }) => {
	const [newPassword, setNewPassword] = useState<string>('')
	const [repeatNewPassword, setRepeatNewPassword] = useState<string>('')
	const [isValidLink, setIsValidLink] = useState<string>('')
	const [infoMessage, setInfoMessage] = useState<string>('')
	const [isFetching, setIsFetching] = useState<boolean>(false)

	const router = useRouter()
	const session = useSession()

	const handleSubmit = async () => {
		if (isFetching) {
			return false
		}
		setIsFetching(true)

		try {
			if (
				newPassword !== repeatNewPassword ||
				newPassword.length < 6 ||
				repeatNewPassword.length < 6 ||
				newPassword.length > 40 ||
				repeatNewPassword.length > 40
			) {
				return false
			}
			const fetchResult = await fetchRecoveryPassword(link, newPassword)
			if (fetchResult === 'ok') {
				router.push(LOGIN_ROUTE)
			} else {
				setInfoMessage(fetchResult)
			}
		} catch (e: any) {
			if (e.response && e.response.status === 404) {
				setInfoMessage(e.response.data.message)
			} else {
				setInfoMessage(e.message || 'Виникла помилка')
			}
		} finally {
			setIsFetching(false)
		}
	}

	useEffect(() => {
		if (session.status === 'authenticated') {
			router.push('/')
		}
		;(async () => {
			try {
				const response = await checkRecoveryLink(link)
				if (response === 'ok') {
					setIsValidLink(response)
				}
			} catch (e: any) {
				if (e.response && e.response.status === 404) {
					setIsValidLink(e.response.data.message)
				} else {
					setIsValidLink(e.message || 'Сталася помилка, повторіть спробу')
				}
			}
		})()
	}, [])

	if (isValidLink !== 'ok') {
		return (
			<div className='body-auth d-flex justify-content-center align-items-center mt-5'>
				<Card className='p-4 p-sm-5' style={{ width: 600 }}>
					<div>{isValidLink}</div>
				</Card>
			</div>
		)
	}

	return (
		<div className='body-auth d-flex justify-content-center align-items-center mt-5'>
			<Card className='p-4 p-sm-5' style={{ width: 600 }}>
				<Form className='d-flex flex-column'>
					<h1 className='m-auto'>Встановлення нового пароля</h1>

					<Form.Group>
						<Form.Control
							value={newPassword}
							className='mt-4 recovery-input'
							size='lg'
							type='password'
							onChange={e => setNewPassword(e.target.value)}
							placeholder='Вкажіть новий пароль'
						/>
					</Form.Group>

					<Form.Group>
						<Form.Control
							value={repeatNewPassword}
							className='mt-4 recovery-input'
							size='lg'
							type='password'
							onChange={e => setRepeatNewPassword(e.target.value)}
							onKeyDown={async e => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault()
									await handleSubmit()
								}
							}}
							placeholder='Повторіть пароль'
						/>
					</Form.Group>
					<Form.Text className='text-muted'></Form.Text>
					{newPassword !== repeatNewPassword ? (
						<Form.Text className='text-muted'>Паролі не сходяться</Form.Text>
					) : (
						''
					)}

					{infoMessage.length !== 0 ? (
						<Form.Text className='text-muted'>{infoMessage}</Form.Text>
					) : (
						''
					)}
					<Row className='d-flex justify-content-between align-items-center mt-2 pl-3 pr-3'>
						<Col xs={5}>
							<Button
								size='lg'
								variant='outline-dark'
								onClick={async () => {
									await handleSubmit()
								}}
							>
								{isFetching ? 'Йде відправка...' : 'Відправити'}
							</Button>
						</Col>
					</Row>
				</Form>
			</Card>
		</div>
	)
}

export default RecoveryPassword

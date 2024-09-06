'use client'
import GoogleButton from '@/components/GoogleButton'
import { FORGOT_PASSWORD_ROUTE, REGISTRATION_ROUTE } from '@/consts/links'
import { login } from '@/services/userAPI'
import '@/styles/Auth.css'
import { validateEmail } from '@/utils/serviceUtils'
import Cookies from 'js-cookie'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEventHandler, useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'

export default function Login() {
	const [errorValid, setErrorValid] = useState<string>('')

	const router = useRouter()
	const { status } = useSession()

	useEffect(() => {
		if (status === 'authenticated') {
			router.push('/')
		}
	}, [])
	const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
		event.preventDefault()

		if (status === 'authenticated') {
			router.push('/')
			return false
		}

		const failAuthBlock = Cookies.get('failAuthBlock')

		if (failAuthBlock) {
			const blockAuth = JSON.parse(failAuthBlock).blockAuth
			const currentTime = Date.now()

			if (blockAuth > currentTime) {
				const timeLeft = Math.ceil((blockAuth - currentTime) / 1000 / 60)
				setErrorValid(
					`Перевищено кількість спроб авторизації, буде доступно через ${timeLeft} хвилини`
				)
				return
			}
		}

		const formData = new FormData(event.currentTarget)

		const password = formData.get('password')
		const email = formData.get('email')

		if (typeof email === 'string' && typeof password === 'string') {
			if (password.length < 6 || password.length > 40) {
				setErrorValid(
					'ваш пароль має неприпустиму кількість символів, він має складатися з 6-40 символів'
				)
				return false
			}
			if (!validateEmail(email) || email.length === 0) {
				setErrorValid('вкажіть пошту в правильному форматі')
				return false
			}
		} else {
			setErrorValid('заповніть поле')
			return false
		}
		try {
			await login(email, password)
		} catch (error: any) {
			if (error.response.status === 429) {
				setErrorValid(error.response.data.message)
			}
		}
		try {
			const res = await signIn('credentials', {
				email: email,
				password: password,
				checkbox: false,
				redirect: false,
			})

			if (res && res.ok && !res.error) {
				router.push('/')
			} else {
				setErrorValid(res!.error!)
			}
		} catch (error: any) {
			setErrorValid(error.message)
		}
	}

	return (
		<Form className='d-flex flex-column' onSubmit={handleSubmit}>
			<h1 className='m-auto form-title'>Авторизація</h1>
			<Form.Group>
				<Form.Control
					className='auth-input mt-4'
					size='lg'
					type='email'
					name='email'
					placeholder='Електронна адреса'
				/>
			</Form.Group>
			<Form.Group>
				<Form.Control
					className='auth-input mt-4'
					size='lg'
					type='password'
					name='password'
					placeholder='Ваш пароль'
				/>
				{errorValid && (
					<Form.Text className='errorValid'>{errorValid}</Form.Text>
				)}
			</Form.Group>
			<Row className='d-flex justify-content-between flex-column flex-sm-row align-items-center align-items-sm-center mt-2 pl-3 pr-3'>
				<Col xs={12} sm={7}>
					<>
						<div>
							Немає облікового запису?{' '}
							<Link href={REGISTRATION_ROUTE}>Зареєструватись</Link>
						</div>
						<div>
							Забули пароль? <Link href={FORGOT_PASSWORD_ROUTE}>Відновити</Link>
						</div>
					</>
					<GoogleButton />
				</Col>
				<Col
					xs={12}
					sm={5}
					className='d-flex justify-content-center justify-content-sm-start'
				>
					<Button
						size='lg'
						className='auth-button'
						variant='outline-dark'
						type='submit'
					>
						увійти
					</Button>
				</Col>
			</Row>
		</Form>
	)
}

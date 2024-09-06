'use client'
import GoogleButton from '@/components/GoogleButton'
import { LOGIN_ROUTE } from '@/consts/links'
import '@/styles/Auth.css'
import { validateEmail } from '@/utils/serviceUtils'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEventHandler, useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'

export default function Registration() {
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
		}

		const formData = new FormData(event.currentTarget)

		const password = formData.get('password')
		const email = formData.get('email')
		const username = formData.get('username')
		if (
			typeof username === 'string' &&
			typeof email === 'string' &&
			typeof password === 'string'
		) {
			if (username.length === 0 || username.length > 20) {
				setErrorValid(
					'ваш логін має неприпустиму кількість символів, він має складатися з 1-20 символів'
				)
				return false
			}
			if (password.length < 6 || password.length > 40) {
				setErrorValid(
					'ваш пароль має неприпустиму кількість символів, він має складатися від 6 символів'
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
			const res = await signIn('credentials', {
				email,
				password,
				username,
				checkbox: true,
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
			<h1 className='m-auto form-title'>Зареєструватись</h1>
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
					type='text'
					name='username'
					placeholder="Ваше ім'я"
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
					<div>
						Маєте обліковий запис?{' '}
						<Link href={LOGIN_ROUTE}>Авторизуватися</Link>
					</div>
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
						зареєструватись
					</Button>
				</Col>
			</Row>
		</Form>
	)
}

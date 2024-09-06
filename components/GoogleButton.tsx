'use client'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'

function GoogleButton() {
	const callback = async () => {
		try {
			await signIn('google', { callbackUrl: '/' })
		} catch (error) {
			console.log(error)
		}
	}
	return (
		<div
			onClick={callback}
			className='d-flex flex-row align-items-center p-2 mt-2'
			style={{
				cursor: 'pointer',
				width: 'fit-content',
				borderRadius: '3px',
				border: 'none',
				backgroundColor: '#ffff',
				boxShadow: '0px 1px 2px 0px rgb(0 0 0 / 81%)',
			}}
		>
			<Image
				className='me-2'
				width={21}
				height={21}
				src={process.env.NEXT_PUBLIC_API_URL + 'google.png'}
				alt='image_google_icon'
			/>
			Увійти
		</div>
	)
}

export default GoogleButton

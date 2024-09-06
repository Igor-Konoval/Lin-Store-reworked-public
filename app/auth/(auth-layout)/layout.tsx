'use client'
import '@/styles/Auth.css'
import { Card } from 'react-bootstrap'

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<>
			<div className='body-auth'>
				<Card className='p-4 p-sm-5 auth-card-container'>{children}</Card>
			</div>
		</>
	)
}

import Link from 'next/link'
import Image from 'next/image'
import '@/styles/Footer.css'
export default function Footer() {
	return (
		<footer>
			<div id='footer-container'>
				<div id='footer-content'>
					<div className='footer-content-item'>
						<b>Контакти:</b> officiallinstore@gmail.com
					</div>
					<div className='footer-content-item'>
						<b>
							<span className='footer-content-a'>
								<Link href={'/policy'}>Політика конфіденційності</Link>
							</span>
						</b>
					</div>
					<div className='footer-content-item'>
						<b>
							<span className='footer-content-a'>
								<Link href={'/'}>Головна сторінка</Link>
							</span>
						</b>
					</div>
					<div className='footer-content-item'>
						Copyright &copy; 2024 All rights reserved Lin-Store.
					</div>
				</div>
				<div id='footer-logo'>
					<Image
						src={
							process.env.NEXT_PUBLIC_API_URL +
							'2logoStoret_2-removebg-preview.png'
						}
						width={180}
						height={70}
						alt={'main-logo'}
					/>
				</div>
			</div>
		</footer>
	)
}

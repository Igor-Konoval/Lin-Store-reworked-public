'use client'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Link from 'next/link'
import Image from 'next/image'
import '@/styles/Navigation.css'
import { useSession, signOut } from 'next-auth/react'
import {
	BASKET_ROUTE,
	COMMENTS_ROUTE,
	LOGIN_ROUTE,
	ORDER_ROUTE,
	SAVE_LIST_ROUTE,
} from '@/consts/links'
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import { ILinks } from '@/types/ILinks'
import FormSearch from './FormSearch'
import UserProfile from './UserProfile'

export default function NavigationBar() {
	const [showUserProfile, setShowUserProfile] = useState<boolean>(false)
	const navDropdownRef: MutableRefObject<null | HTMLDivElement> = useRef(null)
	const navDropdownCollapseRef: MutableRefObject<null | HTMLButtonElement> =
		useRef(null)
	const [searchExpanded, setSearchExpanded] = useState(false)
	const session = useSession()

	const links: Readonly<ILinks[]> = [
		{
			href: ORDER_ROUTE,
			title: 'Ваші замовлення',
		},
		{
			href: SAVE_LIST_ROUTE,
			title: 'Збережені товари',
		},
		{
			href: COMMENTS_ROUTE,
			title: 'Ваші відгуки/коментарі',
		},
	]

	const toggleSearch = () => {
		setSearchExpanded(!searchExpanded)
	}

	const hideNavBar = (e: MouseEvent) => {
		try {
			const target = e.target as HTMLElement
			if (!target.closest('.navbar') || target.closest('.dropdown-menu')) {
				if (
					(navDropdownRef.current as HTMLDivElement)?.classList.contains('show')
				) {
					;(navDropdownCollapseRef.current as HTMLButtonElement)?.click()
				}
			}
		} catch (e) {
			return false
		}
	}

	useEffect(() => {
		document.addEventListener('click', hideNavBar)
		return () => {
			document.removeEventListener('click', hideNavBar)
		}
	}, [])

	return (
		<Navbar
			expand='lg'
			className={
				'bg-body-tertiary d-flex justify-content-between container-navbar navbar-expand-md'
			}
			fixed='top'
		>
			<Container fluid>
				<Link href={'/'}>
					<Image
						src={
							process.env.NEXT_PUBLIC_API_URL +
							'2logoStoret_2-removebg-preview.png'
						}
						width={180}
						height={70}
						className={'main-logo-navBar'}
						alt={'main-logo'}
					/>
					<Image
						src={process.env.NEXT_PUBLIC_API_URL + 'shortMainLogo.png'}
						width={180}
						height={70}
						className={'short-main-logo-navBar'}
						alt='main_short_image_Lin_Store'
					/>
				</Link>
				<Nav
					className='me-auto my-2 my-lg-0'
					style={{ maxHeight: '100px' }}
					navbarScroll
				></Nav>
				<Form
					className={`ml-auto d-flex justify-content-end ${
						searchExpanded ? 'expanded' : ''
					} form-search`}
					onFocus={toggleSearch}
					onBlur={toggleSearch}
				>
					<Image
						className={'img-search'}
						src={process.env.NEXT_PUBLIC_API_URL + 'search.png'}
						alt='image_search'
						width={20}
						height={20}
					/>
					<FormSearch />
				</Form>
				{session.status === 'loading' ? (
					<span className='px-sm-4 py-4 mx-lg-5 text-decoration-none text-black'>
						загрузка
					</span>
				) : session.status !== 'authenticated' ? (
					<Link
						className='px-sm-4 py-4 mx-lg-5 text-decoration-none text-black'
						href={LOGIN_ROUTE}
					>
						Увійти
					</Link>
				) : (
					<>
						<Navbar.Toggle
							role='navigation'
							aria-controls='navbarScroll'
							ref={navDropdownCollapseRef}
							className='ms-sm-3'
						/>
						<Navbar.Collapse
							role='navigation'
							ref={navDropdownRef}
							id='navbarScroll'
						>
							<Nav
								className='navBar-nav-control me-auto my-2 my-lg-0'
								style={{ maxHeight: '100px' }}
								navbarScroll
							></Nav>
							{session.data.user.role === 'Admin' && (
								<Link href={'/admin'} className={'order-sm-0 adminPanel'}>
									адмін панель
									<Image
										style={{ marginLeft: '3px' }}
										width={25}
										height={25}
										src={process.env.NEXT_PUBLIC_API_URL + 'administrator.png'}
										alt='image_administrator'
									/>
								</Link>
							)}
							<>
								<div className='py-4 ps-1 pe-1 d-flex align-items-center'>
									<NavDropdown
										title={session.data.user.name}
										id='navbarScrollingDropdown'
									>
										<NavDropdown.Item
											className='navdrop-link'
											onClick={() => setShowUserProfile(true)}
										>
											<div className='navdrop-link'>Профіль</div>
										</NavDropdown.Item>
										{links.map((link, index) => (
											<NavDropdown.Item key={index} as='div' role='div'>
												<Link
													className='d-block navdrop-link text-decoration-none text-black'
													href={link.href}
												>
													{link.title}
												</Link>
											</NavDropdown.Item>
										))}
										<NavDropdown.Divider />
										<NavDropdown.Item
											className='navdrop-link'
											onClick={() => signOut({ callbackUrl: '/' })}
										>
											<div className='navdrop-link'>Вихід</div>
										</NavDropdown.Item>
									</NavDropdown>
									<Image
										style={{ marginLeft: '3px' }}
										width={25}
										height={25}
										src={process.env.NEXT_PUBLIC_API_URL + 'account.png'}
										alt='image_account_user'
									/>
								</div>
								<Link
									style={{ cursor: 'pointer' }}
									className='d-flex text-decoration-none text-black'
									href={BASKET_ROUTE}
								>
									<Image
										className='mx-1'
										width='23'
										height='23'
										src={process.env.NEXT_PUBLIC_API_URL + 'basket.png'}
										alt='image_basket'
									/>
									<div>Кошик</div>
								</Link>
							</>
						</Navbar.Collapse>
					</>
				)}
			</Container>
			<UserProfile
				show={showUserProfile}
				onHide={() => setShowUserProfile(false)}
			/>
		</Navbar>
	)
}

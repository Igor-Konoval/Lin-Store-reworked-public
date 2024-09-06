'use client'
import Image from 'next/image'
import '@/styles/FormSearch.css'
import React, { useEffect, useRef, useState, FC } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { shortSearch } from '@/services/searchAPI'
import { createEventRedError, escapeFunc } from '@/utils/serviceUtils'
import { checkRating } from './ratingUtils'
import { ISearchTerm } from '@/types/ISearch'

const FormSearch: FC = () => {
	const [searchTerm, setSearchTerm] = useState<string>('')
	const [searchResult, setSearchResult] = useState<ISearchTerm[]>([])
	const [isFocused, setIsFocused] = useState(false)
	const [selectSearch, setSelectSearch] = useState<null | number>(null)

	const router = useRouter()
	const inputRef: any = useRef(null)

	const throttleTimeout = useRef<NodeJS.Timeout | null>(null)

	const throttleFetch = async (searchTerm: string) => {
		if (throttleTimeout.current) {
			clearTimeout(throttleTimeout.current)
		}

		throttleTimeout.current = setTimeout(async () => {
			const result = await shortSearch(searchTerm)
			if (result.status === 200) {
				setSearchResult(result.data)
			} else if (result.status === 403) {
				setSearchResult([])
			}
		}, 140)
	}

	useEffect(() => {
		;(async () => {
			if (searchTerm.trim() !== '') {
				await throttleFetch(searchTerm.trim())
			}
			setSelectSearch(null)
		})()
	}, [searchTerm])

	const onClickHandler = async (searchTerm: string) => {
		if (searchTerm.trim().length === 0) {
			return false
		}
		setSearchTerm(searchTerm.trim())
		setSelectSearch(null)

		router.push(`/filters/p=1/search=${searchTerm}`)
	}

	const onFocusHandler = () => {
		setIsFocused(true)
		setSelectSearch(null)
	}

	const onBlurHandler = () => {
		setTimeout(() => {
			setIsFocused(false)
			inputRef.current?.blur()
			setSelectSearch(null)
		}, 100)
	}

	const handleListKeyDown = async (e: any) => {
		if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
			return false
		}

		if (e.key === 'Enter') {
			e.preventDefault()
			await handleOnSubmit(e)
			return false
		}

		if (selectSearch === null) {
			if (e.key === 'ArrowUp') {
				e.preventDefault()
				setSelectSearch(searchResult.length - 1)
			} else if (e.key === 'ArrowDown') {
				e.preventDefault()
				setSelectSearch(0)
			}
		} else {
			if (e.key === 'ArrowUp') {
				e.preventDefault()
				setSelectSearch(prev => {
					if (prev === null) return searchResult.length - 1
					return prev > 0 ? prev - 1 : searchResult.length - 1
				})
			} else if (e.key === 'ArrowDown') {
				e.preventDefault()
				setSelectSearch(prev => {
					if (prev === null) return 0
					return prev < searchResult.length - 1 ? prev + 1 : 0
				})
			}
		}
	}

	const handleOnSubmit = async (e: React.KeyboardEvent<any>) => {
		try {
			const searchValue =
				selectSearch !== null ? searchResult[selectSearch] : undefined
			if (searchValue === undefined) {
				onClickHandler(searchTerm.trim())
				setSelectSearch(null)
				onBlurHandler()
				e.preventDefault()
			} else if (!searchValue.img) {
				await onClickHandler(searchValue.name)
				onBlurHandler()
				e.preventDefault()
			} else {
				router.push('/product/' + searchValue.name)
				onBlurHandler()
				e.preventDefault()
			}
		} catch (e) {
			createEventRedError('Помилка дії', 'Сталася помилка під час пошуку')
		}
	}

	return (
		<>
			<Form.Control
				type='search'
				placeholder='Пошук товару'
				value={searchTerm}
				onChange={e => {
					setSearchTerm(escapeFunc(e.target.value))
				}}
				className='me-1 form-control-search'
				aria-label='Search'
				onFocus={onFocusHandler}
				onBlur={onBlurHandler}
				onKeyDown={handleListKeyDown}
				ref={inputRef}
			/>
			{isFocused && searchResult.length > 0 && (
				<div
					style={{
						position: 'fixed',
						top: '10%',
						left: '0',
						width: '100%',
						height: '100%',
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						zIndex: 1,
					}}
				></div>
			)}
			{isFocused && searchResult.length ? (
				<div className='search-result-container'>
					{searchResult.map((value, index) => (
						<Row
							key={value._id}
							style={
								selectSearch === index
									? {
											backgroundColor: '#f1f1f1',
											margin: 'initial',
									  }
									: {}
							}
							className='p-2 hover-search-element'
						>
							{value.img ? (
								<Col
									onMouseDown={async () => {
										router.push('/product/' + value.name)
									}}
								>
									<Row>
										<Col>
											<Image
												width={65}
												height={65}
												alt='product_icon'
												src={value.img[0]}
											/>
										</Col>
										<Col>
											<Row className='d-flex flex-column'>
												<Col className='fw-semibold'>{value.name}</Col>
												{value.totalRating !== undefined && (
													<Col className='d-flex'>
														{checkRating(value.totalRating)}
													</Col>
												)}
												<Col className='text-muted'>{`${value.price} грн`}</Col>
											</Row>
										</Col>
									</Row>
								</Col>
							) : (
								<>
									<Col
										onMouseDown={async () => await onClickHandler(value.name)}
										className='fs-5 text-muted'
									>
										<Image
											src={process.env.NEXT_PUBLIC_API_URL + 'search.png'}
											alt='image_search_icon'
											width={23}
											height={23}
											className='me-2'
										/>
										{value.name}
									</Col>
								</>
							)}
						</Row>
					))}
				</div>
			) : (
				''
			)}
			<Button
				className='button-search-navBar'
				onClick={async () => await onClickHandler(searchTerm.trim())}
				variant='outline-success'
				aria-label='search'
			>
				Знайти
			</Button>
		</>
	)
}

export default FormSearch

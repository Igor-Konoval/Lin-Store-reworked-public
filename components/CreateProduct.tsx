'use client'
import styles from '@/styles/Product.module.css'
import '@/styles/CreateProduct.css'
import React, {
	ChangeEvent,
	FC,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { Button, Card, Col, Form, Image, Modal, Row } from 'react-bootstrap'
import { IAdminModal } from '@/types/IAdmin'
import { IDescription } from '@/types/IProduct'
import { fetchFilters } from '@/services/filterAPI'
import { IFilter } from '@/types/IFilter'
import { createProduct } from '@/services/adminAPI'
import { createEventRedError } from '@/utils/serviceUtils'

type TypeColor = {
	color: string
	count: number
	urlImg: File | null
	_id?: string
	number: number
}

interface IProductDesc extends IDescription {
	number: number
}

const CreateProduct: FC<IAdminModal> = ({ show, onHide }) => {
	const [filters, setFilters] = useState<{
		brands: IFilter[]
		types: IFilter[]
	}>({ brands: [], types: [] })
	const [selectedBrand, setSelectedBrand] = useState<string>('')
	const [selectedType, setSelectedType] = useState<string>('')
	const [file, setFile] = useState<null | File>(null)
	const [nameProduct, setNameProduct] = useState<string>('')
	const [wasInUsed, setWasInUsed] = useState<boolean>(false)
	const [price, setPrice] = useState<number>()
	const [description, setDescription] = useState<IProductDesc[]>([])
	const [colors, setColors] = useState<TypeColor[]>([])
	const [imgGallery, setImgGallery] = useState<File[]>([])
	const [shortDescription, setShortDescription] = useState<string>('')
	const [fetching, setFetching] = useState<boolean>(false)

	const cardMainImg = useMemo(
		() => (file ? URL.createObjectURL(file) : null),
		[file]
	)

	useEffect(() => {
		fetchFilters()
			.then(result => setFilters(result))
	}, [])

	useEffect(() => {
		return () => {
			if (file) {
				URL.revokeObjectURL(cardMainImg as string)
			}
		}
	}, [cardMainImg, file])

	const addDescription = useCallback(() => {
		if (description.length === 0) {
			setDescription([
				{
					title: 'Категория',
					description:
						filters.types.find(type => type._id === selectedType)?.name || '',
					number: Date.now(),
				},
				{
					title: 'Бренд',
					description:
						filters.brands.find(brand => brand._id === selectedBrand)?.name ||
						'',
					number: Date.now() + 1,
				},
			] as IProductDesc[])
		} else if (description.length === 1) {
			setDescription([
				...description,
				{
					title: 'Бренд',
					description:
						filters.brands.find(brand => brand._id === selectedBrand)?.name ||
						'',
					number: Date.now(),
				},
			] as IProductDesc[])
		} else {
			setDescription([
				...description,
				{ title: '', description: '', number: Date.now() },
			] as IProductDesc[])
		}
	}, [description, filters.brands, filters.types, selectedBrand, selectedType])

	const removeDescription = useCallback(
		(number: number) => {
			setDescription(description.filter(value => value.number !== number))
		},
		[description]
	)
	
	const changeDescription = useCallback(
		(key: string, info: string, number: number) => {
			setDescription(
				description.map(value =>
					value.number === number ? { ...value, [key]: info } : value
				)
			)
		},
		[description]
	)
	
	const addColor = useCallback(() => {
		const newColor: TypeColor = {
			color: '',
			count: 0,
			urlImg: file && colors.length === 0 ? file : null,
			number: Date.now(),
		} as TypeColor
		if (file && colors.length === 0) {
			newColor.urlImg = file
		}
		setColors([...colors, newColor])
	}, [colors, file])

	const addColorCount = useCallback(
		(colorCount: number, number: number) => {
			setColors(
				colors.map(value =>
					value.number === number ? { ...value, count: colorCount } : value
				)
			)
		},
		[colors]
	)

	const removeColor = useCallback(
		(number: number) => {
			setColors(colors.filter(value => value.number !== number))
		},
		[colors]
	)

	const changeColor = useCallback(
		(key: string, info: File | string, number: number) => {
			setColors(
				colors.map(value =>
					value.number === number ? { ...value, [key]: info } : value
				)
			)
		},
		[colors]
	)

	const selectFileForColor = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>, number: number) => {
			if (e.target.files && e.target.files[0]) {
				changeColor('urlImg', e.target.files[0], number)
			}
		},
		[changeColor]
	)

	const generateUniqueId = (): string => {
		const random = Math.floor(Math.random() * 9000000) + 1000000

		return random.toString().substring(0, 12)
	}

	const { brands, types } = filters

	const changeTypeHandler = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			const id =
				filters.types.find(type => type.name === e.target.value)?._id || ''
			setSelectedType(id)
		},
		[filters.types]
	)

	const changeBrandHandler = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			const id: string =
				brands.find(brand => brand.name === e.target.value)?._id || ''
			setSelectedBrand(id)
		},
		[filters.brands]
	)

	const selectFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0])
		}
	}, [])

	const addProduct = async () => {
		if (fetching) {
			return false
		}
		setFetching(true)
		if (file !== null && price) {
			try {
				const formData = new FormData()
				formData.append('name', nameProduct + ' (' + generateUniqueId() + ')')
				formData.append('price', price.toString())!
				const blobFile = file.slice(0, file.size, 'image/jpeg')
				const newFile = new File([blobFile], 'img', { type: 'image/jpeg' })
				formData.append(`img`, newFile)

				imgGallery.forEach((image, index) => {
					formData.append(`imgGallery[${index}]`, image)
				})

				formData.append('wasInUsed', wasInUsed.toString())
				formData.append('brandId', selectedBrand)
				formData.append('typeId', selectedType)
				formData.append('description', JSON.stringify(description))
				formData.append('shortDescription', shortDescription)
				colors.forEach((colorProduct, index) => {
					formData.append(
						`colors`,
						JSON.stringify({
							index,
							color: colorProduct.color,
							count: colorProduct.count,
						})
					)

					if (colorProduct.urlImg instanceof File) {
						formData.append(`colors[${index}][urlImg]`, colorProduct.urlImg)
					}
				})

				await createProduct(formData).then(data => {
					setWasInUsed(false)
					setColors([])
					setImgGallery([])
					onHide()
				})
			} catch (e: any) {
				createEventRedError(
					'Ошибка',
					`Произошла ошибка создания ${e.response.data.message}`
				)
			} finally {
				setFetching(false)
			}
		}
	}

	return (
		<>
			<Modal
				show={show}
				onHide={onHide}
				size='lg'
				aria-labelledby='contained-modal-title-vcenter'
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title id='contained-modal-title-vcenter'>
						Создать продукт
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className='mb-3'>
							<Form.Label>Название продукта</Form.Label>
							<Form.Control
								value={nameProduct}
								onChange={e => setNameProduct(e.target.value)}
								placeholder='название продукта'
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Короткая информация товара</Form.Label>
							<Form.Control
								value={shortDescription}
								onChange={e => setShortDescription(e.target.value)}
								placeholder='короткая информация'
							/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Указать цену</Form.Label>
							<Form.Control
								type='number'
								onChange={e => setPrice(+e.target.value)}
								placeholder='цена'
							></Form.Control>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Указать что товар б/у</Form.Label>
							<Form.Check
								type='checkbox'
								checked={wasInUsed}
								title='товар б/у'
								onChange={e => {
									setWasInUsed(e.target.checked)
								}}
							></Form.Check>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Указать тип продукта</Form.Label>
							<Form.Select onChange={e => changeTypeHandler(e)}>
								<option>Выбрать тип</option>
								{types.map(type => (
									<option key={type._id}>{type.name}</option>
								))}
							</Form.Select>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Указать брэнд продукта</Form.Label>
							<Form.Select onChange={e => changeBrandHandler(e)}>
								<option>Выбрать брэнд</option>
								{brands.map(brand => (
									<option key={brand._id}>{brand.name}</option>
								))}
							</Form.Select>
						</Form.Group>
						<hr />
						<Form.Group controlId='formFileMultiple' className='mb-3'>
							<Form.Label>Добавить главное изображение</Form.Label>
							<Form.Control type='file' onChange={selectFile} />
						</Form.Group>
						<hr />
						<Button variant='outline-dark' onClick={addColor}>
							Добавить цвет товара и количество
						</Button>
						{colors.map((i, index) => (
							<Row key={i.number} className={styles['container-inputs']}>
								<Col xs={4} sm={4}>
									<Form.Group controlId='formFileMultiple'>
										{index === 0 ? (
											<Form.Label>Цвет (как главное изображение)</Form.Label>
										) : (
											<Form.Label>Цвет</Form.Label>
										)}
										<Form.Control
											placeholder='Цвет'
											value={i.color}
											onChange={e =>
												changeColor('color', e.target.value, i.number)
											}
										/>
									</Form.Group>
								</Col>
								<Col xs={3} sm={3}>
									<Form.Group controlId='formFileMultiple'>
										<Form.Label>Количество</Form.Label>
										<Form.Control
											onChange={e => addColorCount(+e.target.value, i.number)}
											placeholder='количество'
											type='number'
										/>
									</Form.Group>
								</Col>
								<Col xs={3} sm={3}>
									<Form.Group controlId='formFileMultiple'>
										<Form.Label>Изображение</Form.Label>
										<Form.Control
											type='file'
											onChange={e =>
												selectFileForColor(
													e as ChangeEvent<HTMLInputElement>,
													i.number
												)
											}
										/>
									</Form.Group>
								</Col>
								<Col xs={2} sm={1} className='mt-auto p-0'>
									<Button
										variant='outline-dark'
										size={'sm'}
										onClick={() => removeColor(i.number)}
									>
										<Image
											src={
												process.env.NEXT_PUBLIC_API_URL + 'icons8-close-24.png'
											}
										/>
									</Button>
								</Col>
							</Row>
						))}
						<hr />

						<Form.Group controlId='formFileMultiple' className='mb-3'>
							<Form.Label>Добавить галерею изображений</Form.Label>
							<Form.Control
								type='file'
								multiple
								onChange={(e: ChangeEvent<HTMLInputElement>) => {
									setImgGallery(Array.from(e.target.files!))
								}}
							/>
						</Form.Group>
						<hr />
						<Button variant='outline-dark' onClick={addDescription}>
							Добавить описание и характеристики
						</Button>
						{description.map((i, index) => (
							<Row
								key={i.number}
								className={[
									'mt-3',
									'd-flex',
									'flex-nowrap',
									styles['container-inputs'],
								].join(' ')}
							>
								{index === 0 ? (
									<>
										<Col xs={5} sm={5}>
											<Form.Group controlId='formFileMultiple' className='mb-3'>
												<Form.Control
													placeholder='Ввести заголовок'
													value={i.title}
													onChange={e =>
														changeDescription('title', e.target.value, i.number)
													}
												/>
											</Form.Group>
										</Col>
										<Col xs={5} sm={5}>
											<Form.Group controlId='formFileMultiple' className='mb-3'>
												<Form.Control
													placeholder='Ввести описание'
													value={i.description}
													onChange={e =>
														changeDescription(
															'description',
															e.target.value,
															i.number
														)
													}
												/>
											</Form.Group>
										</Col>
										<Col xs={2} sm={2} className='p-0'>
											<Button
												variant='outline-dark'
												onClick={() => removeDescription(i.number)}
											>
												<Image
													src={
														process.env.NEXT_PUBLIC_API_URL +
														'icons8-close-24.png'
													}
												/>
											</Button>
										</Col>
									</>
								) : index === 1 ? (
									<>
										<Col xs={5} sm={5}>
											<Form.Group controlId='formFileMultiple' className='mb-3'>
												<Form.Control
													placeholder='Ввести заголовок'
													value={i.title}
													onChange={e =>
														changeDescription('title', e.target.value, i.number)
													}
												/>
											</Form.Group>
										</Col>
										<Col xs={5} sm={5}>
											<Form.Group controlId='formFileMultiple' className='mb-3'>
												<Form.Control
													placeholder='Ввести описание'
													value={i.description}
													onChange={e =>
														changeDescription(
															'description',
															e.target.value,
															i.number
														)
													}
												/>
											</Form.Group>
										</Col>
										<Col xs={1} sm={1} className='p-0'>
											<Button
												variant='outline-dark'
												onClick={() => removeDescription(i.number)}
											>
												<Image
													src={
														process.env.NEXT_PUBLIC_API_URL +
														'icons8-close-24.png'
													}
												/>
											</Button>
										</Col>
									</>
								) : (
									<>
										<Col xs={5} sm={5}>
											<Form.Group controlId='formFileMultiple' className='mb-3'>
												<Form.Control
													placeholder='Ввести заголовок'
													value={i.title}
													onChange={e =>
														changeDescription('title', e.target.value, i.number)
													}
												/>
											</Form.Group>
										</Col>
										<Col xs={5} sm={5}>
											<Form.Group controlId='formFileMultiple' className='mb-3'>
												<Form.Control
													placeholder='Ввести описание'
													value={i.description}
													onChange={e =>
														changeDescription(
															'description',
															e.target.value,
															i.number
														)
													}
												/>
											</Form.Group>
										</Col>
										<Col xs={2} sm={1} className='p-0'>
											<Button
												variant='outline-dark'
												onClick={() => removeDescription(i.number)}
											>
												<Image
													src={
														process.env.NEXT_PUBLIC_API_URL +
														'icons8-close-24.png'
													}
												/>
											</Button>
										</Col>
									</>
								)}
							</Row>
						))}
					</Form>
					<div className='my-2'>
						<p>Примерный вид товара</p>
					</div>
					<Card className={styles['card-product']}>
						{file && cardMainImg && (
							<Card.Img
								className={styles[`card-img-product`]}
								src={cardMainImg}
							/>
						)}
						<Card.Body className={styles['card-body-product']}>
							<Row
								className={[
									'd-flex',
									'justify-content-between',
									'align-content-center',
									'my-1',
									styles['card-body-product-centered'],
								].join(' ')}
							>
								<Col sm={8} xs={12}>
									{nameProduct}
								</Col>
								<Col
									sm={4}
									xs={12}
									className={['text-end', styles['default-product-price']].join(
										' '
									)}
								>{`${price} грн.`}</Col>
							</Row>
							<Row>
								<Col
									className={[
										'text-muted',
										styles['card-product-shortDesc'],
									].join(' ')}
								>
									{shortDescription}
								</Col>
							</Row>
							<Row className='d-flex align-items-center'>
								<Col className='d-flex my-1'>
									{'рейтинг'}
									<span className='text-muted ms-1'>{`(${0})`}</span>
								</Col>
								<Col
									xl={5}
									xs={12}
									className='text-muted fw-semibold fs-6'
								>{`продаж ${0}`}</Col>
							</Row>
							<Row>
								<Col
									sm={4}
									xs={12}
									className={[
										'text-end',
										styles['small-screen-product-price'],
									].join(' ')}
								>{`${price} грн.`}</Col>
								<Col className='d-flex justify-content-end'>
									<Button
										variant='outline-dark'
										size='lg'
										className={[
											'd-flex',
											'align-items-center',
											styles['button-add-basket'],
										].join(' ')}
									>
										{' '}
										в корзину
										<Image
											className='ms-2'
											width={25}
											height={25}
											src={
												process.env.NEXT_PUBLIC_API_URL + 'add-to-basket.png'
											}
										/>
									</Button>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={onHide}>Закрыть</Button>
					<Button onClick={addProduct}>
						{fetching ? 'идет отправка' : 'Добавить продукт'}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default CreateProduct

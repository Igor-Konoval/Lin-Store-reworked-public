'use client'
import PhoneInput from 'react-phone-number-input/input'
import '@/styles/ModalPostal.css'
import React, {
	FC,
	ChangeEvent,
	MutableRefObject,
	useEffect,
	useRef,
	useState,
} from 'react'
import {
	Accordion,
	Button,
	Col,
	Form,
	FormControl,
	FormGroup,
	FormLabel,
	FormSelect,
	Image,
	Modal,
	Row,
} from 'react-bootstrap'
import {
	ICheckDetails,
	IIdentifyDepartment,
	IModalPostalComponent,
	ISelectCity,
	ISelectStreet,
} from '@/types/IPostalModal'
import { getUserProfile } from '@/services/userAPI'
import {
	checkDetails,
	formatDate,
	getStreet,
	identifyCity,
	identifyDepartment,
} from '@/services/postalAPI'
import { fetchBasket } from '@/services/basketAPI'
import { createEventBlueError, createEventRedError } from '@/utils/serviceUtils'

const ModalPostalComponent: FC<IModalPostalComponent> = ({
	onClickHandler,
	show,
	onHide,
	totalPrice,
	reProductList,
}) => {
	const [firstname, setFirstname] = useState<string>('')
	const [surname, setSurname] = useState<string>('')
	const [lastname, setLastname] = useState<string>('')
	const [userPhone, setUserPhone] = useState<number | undefined>(undefined)
	const [userEmail, setUserEmail] = useState<string>('')

	const [city, setCity] = useState<string>('')
	const [selectedCity, setSelectedCity] = useState<ISelectCity>({
		present: '',
		ref: '',
	})
	const [listCity, setListCity] = useState<ISelectCity[]>([])

	const [streetList, setStreetList] = useState<ISelectStreet[]>([])
	const [street, setStreet] = useState<string>('')
	const [selectedStreet, setSelectedStreet] = useState<string>('')

	const [isControlSelectCityFocused, setIsControlSelectCityFocused] =
		useState(false)
	const [isControlSelectStreetFocused, setIsControlSelectStreetFocused] =
		useState(false)
	const [selectedService, setSelectedService] = useState<string>('0')
	const [selectedDepartment, setSelectedDepartment] =
		useState<IIdentifyDepartment>({
			description: '',
			ref: '',
			warehouseIndex: '',
		})
	const [departmentList, setDepartmentList] = useState<IIdentifyDepartment[]>(
		[]
	)
	const [infoPreOrder, setInfoPreOrder] = useState<ICheckDetails | null>(null)
	const [loadInfoDelivery, setLoadInfoDelivery] = useState<boolean>(false)
	const [isFetching, setIsFetching] = useState<boolean>(false)

	const [allowService, setAllowService] = useState<boolean>(false)
	const [allowCity, setAllowCity] = useState<boolean>(false)
	const [allowStreet, setAllowStreet] = useState<boolean>(false)
	const [allowDepartment, setAllowDepartment] = useState<boolean>(false)

	const inputRef: MutableRefObject<HTMLInputElement | null> = useRef(null)
	const inputRefStreet: MutableRefObject<HTMLInputElement | null> = useRef(null)

	useEffect(() => {
		;(async () => {
			try {
				const userData = await getUserProfile()
				setFirstname(userData.firstname)
				setSurname(userData.surname)
				setLastname(userData.lastname)
				setUserPhone(userData.phone)
				setUserEmail(userData.email)
			} catch (error: any) {
				createEventRedError('Сталася помилка', error.message)
			}
		})()
	}, [])

	const onFocusHandler = () => {
		setIsControlSelectCityFocused(true)
	}

	const onBlurHandler = () => {
		setTimeout(() => {
			setIsControlSelectCityFocused(false)
			inputRefStreet.current?.blur()
		}, 100)
	}

	const onFocusHandlerStreet = () => {
		setIsControlSelectStreetFocused(true)
	}

	const onBlurHandlerStreet = () => {
		setTimeout(() => {
			setIsControlSelectStreetFocused(false)
			inputRefStreet.current?.blur()
			setAllowStreet(true)
		}, 100)
	}

	const handleSelectCity = async (currentCity: ISelectCity) => {
		setCity(currentCity.present)
		setListCity([currentCity])
		setSelectedCity(currentCity)
		try {
			const result = await identifyDepartment(currentCity.ref)
			setDepartmentList(result)
			setAllowCity(true)
		} catch (error: any) {
			createEventRedError('сталася помилка', error.message)
		}
	}

	const handleSelectStreet = (currentStreet: ISelectStreet) => {
		setStreet(currentStreet.street)
		setSelectedStreet(currentStreet.ref)
		setStreetList([currentStreet])
	}

	const handleCheckDetails = async () => {
		setLoadInfoDelivery(true)
		try {
			const result = await checkDetails(selectedCity.ref, 0.5, totalPrice, 1, 1)
			setInfoPreOrder(result)
			setLoadInfoDelivery(false)
		} catch (error: any) {
			createEventRedError('сталася помилка', error.message)
		}
	}

	const handleCreateOrder = async () => {
		if (isFetching) {
			return
		}
		if (
			firstname.length === 0 ||
			surname.length === 0 ||
			lastname.length === 0 ||
			!userPhone ||
			allowService ||
			allowCity === false ||
			allowDepartment === false ||
			allowService === false ||
			allowStreet === false
		) {
			createEventBlueError(
				'Сталася помилка',
				'Заповніть необхідні поля для відправки замовлення'
			)
			return
		}
		setIsFetching(true)

		try {
			await fetchBasket(
				reProductList(),
				selectedDepartment.warehouseIndex,
				selectedCity.ref,
				selectedStreet,
				userPhone + '',
				firstname,
				surname,
				lastname,
				userEmail
			)

			await onClickHandler()
		} catch (e) {
			createEventRedError(
				'Сталася помилка',
				'Помилка створення замовлення, перезавантажте сторінку та повторіть спробу'
			)
		} finally {
			setIsFetching(false)
		}
	}

	const handleResetDetails = () => {
		setAllowCity(false)
		setAllowDepartment(false)
		setAllowService(false)
		setAllowStreet(false)
		setCity('')
		setSelectedCity({
			present: '',
			ref: '',
		})
		setListCity([])
		setStreetList([])
		setStreet('')
		setSelectedStreet('')
		setIsControlSelectCityFocused(false)
		setIsControlSelectStreetFocused(false)
		setSelectedService('0')
		setSelectedDepartment({
			description: '',
			ref: '',
			warehouseIndex: '',
		})
		setDepartmentList([])
		setInfoPreOrder(null)
		setLoadInfoDelivery(false)
	}

	const handleSelectDepartment = (e: ChangeEvent<HTMLSelectElement>) => {
		const selectedIndex = e.target.selectedIndex - 1
		const selectedDepartmentItem = departmentList[selectedIndex]
		setSelectedDepartment(selectedDepartmentItem)
		setAllowDepartment(true)
	}

	useEffect(() => {
		;(async () => {
			if (!departmentList.length) {
				return
			} else {
				await handleCheckDetails()
			}
		})()
	}, [selectedDepartment])

	return (
		<>
			<Modal
				keyboard={false}
				size={'xl'}
				backdrop='static'
				centered={true}
				show={show}
				onHide={onHide}
			>
				<Modal.Header closeButton>
					<Modal.Title as='h2'>Створення замовлення</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row>
						<Col>
							<h3>Ваші контактні дані</h3>
							<Form className='p-3'>
								<Form.Group>
									<Form.Label>Прізвище:</Form.Label>
									<Form.Control
										type='text'
										placeholder='вкажіть прізвище'
										value={surname}
										onChange={e => setSurname(e.target.value)}
									/>
								</Form.Group>

								<Form.Group>
									<Form.Label>Ім'я:</Form.Label>
									<Form.Control
										type='text'
										placeholder="Вкажіть ім'я"
										value={firstname}
										onChange={e => setFirstname(e.target.value)}
									/>
								</Form.Group>

								<Form.Group>
									<Form.Label>По батькові:</Form.Label>
									<Form.Control
										type='text'
										placeholder='Вкажіть по батькові'
										value={lastname}
										onChange={e => setLastname(e.target.value)}
									/>
								</Form.Group>

								<Form.Group className='d-flex flex-column'>
									<Form.Label>Телефон:</Form.Label>
									<PhoneInput
										style={{
											paddingLeft: '10px',
											border: '1px solid #00000036',
											borderRadius: '7px',
										}}
										placeholder='Телефон +380...'
										value={userPhone}
										onChange={value =>
											setUserPhone(value as number | undefined)
										}
									/>
								</Form.Group>
								<h3>Доставка</h3>
								<Form.Group className='d-flex flex-column'>
									<FormSelect
										onChange={e => {
											setSelectedService(e.target.value)
											if (e.target.value !== '0') {
												setAllowService(true)
											}
										}}
										disabled={
											firstname.length === 0 ||
											surname.length === 0 ||
											lastname.length === 0 ||
											!userPhone ||
											allowService
										}
									>
										<option value={'0'}>виберіть варіант доставки</option>
										<option value={'1'}>Самовивіз із Нової Пошти</option>
									</FormSelect>
								</Form.Group>
								<FormGroup>
									<FormLabel>Місто</FormLabel>
									<FormControl
										disabled={selectedService === '0' || allowCity}
										className={'control-selectCity'}
										type='text'
										placeholder='вкажіть ваше місто'
										value={city}
										onChange={async e => {
											setCity(e.target.value)
											if (city.length !== 0) {
												const result = await identifyCity(city)
												setListCity(result)
											}
										}}
										onFocus={() => onFocusHandler()}
										onBlur={() => onBlurHandler()}
										ref={inputRef}
									/>
									{listCity.length !== 0 && isControlSelectCityFocused ? (
										<Row className={'container-selectCity'}>
											<Col className={'body-selectCity'}>
												{listCity.map((value, index) => (
													<Row
														key={index}
														onPointerDown={async () =>
															await handleSelectCity(value)
														}
														className='p-1 item-selectCity'
													>
														<Col>{value.present}</Col>
													</Row>
												))}
											</Col>
										</Row>
									) : (
										''
									)}
								</FormGroup>
								<FormGroup>
									<FormLabel>Вулиця</FormLabel>
									<FormControl
										disabled={allowCity === false || allowStreet === true}
										type='text'
										placeholder='Вкажіть вашу вулицю'
										value={street}
										onChange={async e => {
											setStreet(e.target.value)
											if (e.target.value !== '') {
												const result = await getStreet(
													selectedCity.ref,
													e.target.value
												)
												setStreetList(result)
											}
										}}
										onFocus={() => onFocusHandlerStreet()}
										onBlur={() => onBlurHandlerStreet()}
										ref={inputRefStreet}
									/>
									{streetList.length !== 0 && isControlSelectStreetFocused ? (
										<Row className={'container-selectCity'}>
											<Col className={'body-selectCity'}>
												{streetList.map((value, index) => (
													<Row
														key={index}
														onPointerDown={() => handleSelectStreet(value)}
														className='p-1 item-selectCity'
													>
														<Col>{value.street}</Col>
													</Row>
												))}
											</Col>
										</Row>
									) : (
										''
									)}
								</FormGroup>
								<Form.Group className='d-flex flex-column'>
									<Form.Label>Вибір відділення:</Form.Label>
									<FormSelect
										onChange={handleSelectDepartment}
										disabled={
											departmentList.length === 0 ||
											allowStreet === false ||
											allowDepartment === true
										}
									>
										<option>Відділення пошти</option>
										{departmentList.map((value, index) => (
											<option key={index}>{value.description}</option>
										))}
									</FormSelect>
								</Form.Group>
								<div className='mt-3'>
									<Button
										style={{ borderRadius: 50 }}
										variant='outline-dark'
										onClick={handleResetDetails}
									>
										Скинути дані доставки
									</Button>
								</div>
							</Form>
						</Col>
						<Col>
							<h3>Товари до замовлення</h3>
							<Accordion className='mt-2 mb-4' defaultActiveKey='0'>
								<Accordion.Item eventKey={'0'}>
									<Accordion.Header>Вибраний перелік товарів</Accordion.Header>
									<Accordion.Body>
										{reProductList() &&
											reProductList().map((product, index) => (
												<>
													<Row key={index}>
														<Col className='mb-2' sm={12} lg={5}>
															<Image
																width={120}
																height={120}
																src={
																	product.selectedImg! !== 'none'
																		? product.selectedImg!
																		: product.img[0]
																}
															/>
														</Col>
														<Col sm={12} lg={7}>
															<h2 className='fs-5 fw-600'>{`${product.name} (${product.selectedColor})`}</h2>
															<p className='mb-1'>{product.price} грн.</p>
															<p className='mb-0'>
																{product.selectedCount} шт.
															</p>
														</Col>
													</Row>
													<hr />
												</>
											))}
									</Accordion.Body>
								</Accordion.Item>
							</Accordion>
							{loadInfoDelivery && (
								<div className='small-container-spinner'>
									<div className='load-spinner'></div>
								</div>
							)}
							{infoPreOrder && (
								<>
									<h3>Приблизний розрахунок замовлення</h3>
									<Row className='d-flex flex-row text-end fs-5'>
										<Col xs={12}>
											Очікувана дата доставки{' '}
											{formatDate(infoPreOrder.deliveryInfo.date)}
										</Col>
										<Col xs={12}>
											{infoPreOrder.costInfo.Cost} грн. сума доставки
										</Col>
										<Col xs={12}>
											{infoPreOrder.costInfo.AssessedCost} грн. сума товару
										</Col>
										<Col xs={12}>
											{infoPreOrder.costInfo.AssessedCost +
												infoPreOrder.costInfo.Cost}{' '}
											грн. сума замовлення
										</Col>
									</Row>
								</>
							)}
							<Row className='text-end mt-3'>
								<Col>
									<Button
										disabled={
											infoPreOrder === null || selectedDepartment === undefined
										}
										style={{ borderRadius: 50 }}
										onPointerDown={async () => await handleCreateOrder()}
										size='lg'
										variant='outline-dark'
									>
										{isFetching ? 'йде обробка' : 'Замовити'}
									</Button>
								</Col>
							</Row>
						</Col>
					</Row>
				</Modal.Body>
			</Modal>
		</>
	)
}

export default ModalPostalComponent

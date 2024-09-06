'use client'
import AlertBasket from '@/components/AlertBasket'
import ChangeComment from '@/components/ChangeComment'
import CommentsComponent from '@/components/CommentsComponent'
import CreateComment from '@/components/CreateComment'
import CreateResponseComment from '@/components/CreateResponseComment'
import DescriptionProductComponent from '@/components/DescriptionProductComponent'
import { checkRating } from '@/components/ratingUtils'
import RemoveComment from '@/components/RemoveComment'
import SelectedProductImages from '@/components/SelectedProductImages'
import { BASKET_ROUTE, LOGIN_ROUTE } from '@/consts/links'
import { addBasket } from '@/services/basketAPI'
import {
	checkIdSaveList,
	selectIdSaveList,
	updateAuthOldViews,
} from '@/services/productAPI'
import '@/styles/SaveList.css'
import '@/styles/SelectedProduct.css'
import { IColor } from '@/types/IColor'
import { IComment } from '@/types/IComments'
import { ISelectedProduct } from '@/types/IProduct'
import { createEventRedError } from '@/utils/serviceUtils'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
	FC,
	MutableRefObject,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { useViewedListContext } from '../contexts/ViewedListContext/ViewedListContextProvider'

const SelectedProduct: FC<{ product: ISelectedProduct }> = ({ product }) => {
	const session = useSession()

	const [commentsProduct, setCommentsProduct] = useState<IComment[]>([])
	const [showAlert, setShowAlert] = useState<boolean>(false)
	const [message, setMessage] = useState<string>('')

	const [isSaveList, setIsSaveList] = useState<boolean>(false)
	const [selectedColor, setSelectedColor] = useState<IColor | null>(
		product.colors.find(color => color.count > 0) || null
	)
	const [mainCommentUserId, setMainCommentUserId] = useState<string>('')
	const [showModalChangeComment, setShowModalChangeComment] =
		useState<boolean>(false)
	const [changeCommentData, setChangeCommentData] = useState<string>('')
	const [commentUserId, setCommentUserId] = useState<string>('')
	const [selectComUId, setSelectComUId] = useState<string>('')
	const [showResponseToggle, setShowResponseToggle] = useState<boolean>(false)
	const [showModal, setShowModal] = useState<boolean>(false)
	const [showModalResponse, setShowModalResponse] = useState<boolean>(false)
	const [toggleShowRemoveComment, setToggleShowRemoveComment] =
		useState<boolean>(false)

	const { updateSaveList } = useViewedListContext()

	const target = useRef(null)
	const handleImageClick = useRef<any>(null)

	const { status } = useSession()

	const router = useRouter()

	const posTarget: MutableRefObject<HTMLElement | null> = useRef(null)
	const heightTarget: MutableRefObject<HTMLDivElement | null> = useRef(null)

	useEffect(() => {
		const handlePopState = () => {
			window.scrollTo({
				top: 0,
			})
			scrollHandler()
		}
		window.addEventListener('popstate', handlePopState)

		return () => {
			window.removeEventListener('popstate', handlePopState)
		}
	}, [])

	useEffect(() => {
		;(async () => {
			try {
				if (session.status === 'authenticated') {
					updateAuthOldViews(product)
					updateSaveList(product)
					await checkIdSaveList(product._id).then(data =>
						setIsSaveList(data || false)
					)
				}
			} catch (error) {
				throw new Error('сталася помилка')
			}
		})()
	}, [])

	const scrollHandler = () => {
		if (!heightTarget.current) {
			return
		}
		if (document.documentElement.clientWidth <= 740) {
			return
		}

		const currentHeight = getComputedStyle(
			heightTarget.current as HTMLDivElement
		).height.slice(0, -2)

		const bottomComponent = (posTarget.current as HTMLElement).offsetHeight

		if (bottomComponent + window.scrollY >= +currentHeight) {
			if (
				(posTarget.current as HTMLElement).classList.contains(
					'sideInfoAbsolute-device'
				)
			) {
				return false
			} else {
				;(posTarget.current as HTMLElement).className =
					'sideInfoAbsolute-device'
				return false
			}
		} else {
			if (
				(posTarget.current as HTMLElement).classList.contains(
					'sideInfoAbsolute-device'
				)
			) {
				;(posTarget.current as HTMLElement).className = 'sideInfoFixed-device'
				return false
			} else {
				return false
			}
		}
	}

	useEffect(() => {
		scrollHandler()
		window.addEventListener('scroll', scrollHandler)
		return () => {
			window.removeEventListener('scroll', scrollHandler)
		}
	}, [])

	const handlerSelectSaveList = async () => {
		if (status !== 'authenticated') {
			router.push(LOGIN_ROUTE)
		} else if (status === 'authenticated') {
			await selectIdSaveList(product._id)
				.then(data => setIsSaveList(data || false))
				.catch(error =>
					createEventRedError('Сталася помилка', 'Спробуйте пізніше')
				)
		}
	}

	const memoSelectedProductImages = useMemo(
		() => (
			<SelectedProductImages
				img={product.img}
				wasInUsed={product.wasInUsed}
				ref={handleImageClick}
			/>
		),
		[product.img, product.wasInUsed]
	)

	const memoCommentsProduct = useMemo(
		() => (
			<CommentsComponent
				productId={product._id}
				userId={session.data?.user.userId || null}
				comments={commentsProduct}
				setComments={setCommentsProduct}
				setMainCommentUserId={setMainCommentUserId}
				setShowModalChangeComment={setShowModalChangeComment}
				setChangeCommentData={setChangeCommentData}
				setCommentUserId={setCommentUserId}
				setSelectComUId={setSelectComUId}
				setShowResponseToggle={setShowResponseToggle}
				setShowModal={setShowModal}
				setShowModalResponse={setShowModalResponse}
				setToggleShowRemoveComment={setToggleShowRemoveComment}
			/>
		),
		[product._id, session, commentsProduct]
	)

	return (
		<>
			<div ref={heightTarget} className='body-page'>
				<main>
					<div className='pb-4 ps-3 header-type-brand'>
						<div className='header-type-brand-block'>
							<h2 className='mx-2'>{product.typeId}</h2>/{' '}
							<h2 className='mx-2'>{product.brandId}</h2>/{' '}
							<h2 className='mx-2 text-black'>{product.name}</h2>
						</div>
					</div>

					<section>
						<Row className='m-auto d-flex justify-content-between flex-wrap'>
							<Col md={6} xs={12} className='container-mainImg'>
								{memoSelectedProductImages}
							</Col>
							<Col
								ref={posTarget}
								md={6}
								xs={12}
								className={'sideInfoFixed-device'}
							>
								<Row className='d-flex'>
									<h1>{product.name}</h1>
									<h2 className='header-product-shortDescription'>
										{product.shortDescription}
									</h2>
									<div className='d-flex pb-1 align-items-center'>
										{checkRating(product.totalRating)}
										<div
											style={{
												fontSize: '20px',
												fontWeight: '600',
												marginLeft: '5px',
											}}
										>
											{`(${product.countRating})`}
										</div>
									</div>
									<hr />
									<h2 className='fs-3'>{'Ціна ' + product.price + ' грн'}</h2>
									<hr />
									{selectedColor && (
										<h3 className='m-auto fw-normal fs-5'>
											Вибрати колір, залишилося {selectedColor.count} шт.
										</h3>
									)}
									<>
										<div className='d-flex flex-wrap p-0'>
											{product.colors.map((value, index) => (
												<h4
													key={index}
													className={`colorImg ${
														value.count === 0 ? 'outOfStockColorImg' : ''
													} ${
														selectedColor !== null
															? selectedColor.color === value.color
																? 'selectedColorImg'
																: ''
															: ''
													}`}
													onClick={e => {
														if (handleImageClick.current !== null) {
															if (value.count === 0) {
																return false
															}
															handleImageClick.current(value.urlImg)
															setSelectedColor(value)
														}
													}}
												>
													{value.count === 0
														? value.color + ' закінчився'
														: value.color}
													<Image
														width={20}
														height={20}
														quality={50}
														src={value.urlImg}
														alt=''
														style={{ display: 'none' }}
													/>
												</h4>
											))}
										</div>
										<hr />
										<Row className='pb-3 d-flex flex-wrap flex-row m-auto px-0 ps-1'>
											<Col className='d-flex flex-row align-items-center px-0'>
												<Button
													onClick={handlerSelectSaveList}
													variant='outline-dark'
													size='lg'
													className='container-save-button'
												>
													{isSaveList ? (
														<>
															в обраному
															<Image
																className='ms-2'
																alt='image_filled_heart'
																width={25}
																height={25}
																src={
																	process.env.NEXT_PUBLIC_API_URL +
																	'trueHeart.png'
																}
															/>
														</>
													) : (
														<>
															Додати в обране
															<Image
																className='ms-2'
																alt='image_hollow_heart'
																width={25}
																height={25}
																src={
																	process.env.NEXT_PUBLIC_API_URL +
																	'falseHeart.png'
																}
															/>
														</>
													)}
												</Button>
											</Col>
										</Row>
										<hr />
										{selectedColor !== null ? (
											<Row className='d-flex pt-lg-3 m-auto px-0 ps-1'>
												<Col className='d-flex px-0'>
													<Button
														variant='secondary'
														size='lg'
														className='container-button'
														onClick={async () => {
															await addBasket(
																product._id,
																selectedColor.color,
																selectedColor.urlImg
															)
															router.push(BASKET_ROUTE)
														}}
													>
														Купити зараз
														<Image
															className='ms-2 btn-img-selectedDevice'
															width={29}
															alt='image_delivery'
															height={29}
															src={
																process.env.NEXT_PUBLIC_API_URL +
																'deliveryWhite.png'
															}
														/>
													</Button>
													<Button
														variant='outline-dark'
														size='lg'
														ref={target}
														className='container-button ms-3'
														onClick={async () => {
															const dataBasket = await addBasket(
																product._id,
																selectedColor.color,
																selectedColor.urlImg
															)
															setMessage(dataBasket)
															setShowAlert(true)
															setTimeout(() => setShowAlert(false), 2400)
														}}
													>
														В кошик
														<Image
															className='ms-2 btn-img-selectedDevice'
															width={25}
															height={25}
															alt='image_add_to_basket'
															src={
																process.env.NEXT_PUBLIC_API_URL +
																'add-to-basket.png'
															}
														/>
													</Button>
												</Col>
											</Row>
										) : (
											<Row className='d-flex pt-1'>
												<p className='fw-600 fs-4'>Немає в наявності</p>
											</Row>
										)}
									</>
								</Row>
							</Col>
						</Row>
					</section>
				</main>
				<section>
					<aside>
						<DescriptionProductComponent description={product.description} />
					</aside>
				</section>
				<section>
					<article>
						<CreateComment
							show={showModal}
							onHide={() => setShowModal(false)}
							productId={product._id}
							setCommentsProduct={setCommentsProduct}
						/>
					</article>
					<article>
						<CreateResponseComment
							show={showModalResponse}
							onHide={() => setShowModalResponse(false)}
							productId={product._id}
							commentUserId={commentUserId}
							mainCommentUserId={mainCommentUserId}
							setCommentsProduct={setCommentsProduct}
						/>
					</article>
					<article>
						<RemoveComment
							show={toggleShowRemoveComment}
							showRemoveResponse={showResponseToggle}
							onHide={() => setToggleShowRemoveComment(false)}
							productId={product._id}
							commentUserId={commentUserId}
							responseCommentUserId={selectComUId}
							setCommentsProduct={setCommentsProduct}
						/>
					</article>
					<article>
						<ChangeComment
							show={showModalChangeComment}
							onHide={() => setShowModalChangeComment(false)}
							productId={product._id}
							commentUserId={commentUserId}
							showChangeResponse={showResponseToggle}
							responseCommentUserId={selectComUId}
							setResponseCommentUserId={setSelectComUId}
							changeCommentData={changeCommentData}
							setChangeCommentData={setChangeCommentData}
							setCommentsProduct={setCommentsProduct}
						/>
					</article>
				</section>
				<section>{memoCommentsProduct}</section>
				<section>
					<AlertBasket message={message} show={showAlert} target={target} />
				</section>
			</div>
		</>
	)
}

export default SelectedProduct

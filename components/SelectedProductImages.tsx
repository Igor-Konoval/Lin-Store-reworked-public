'use client'
import Image from 'next/image'
import Slider from 'react-slick'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

type ProductImages = {
	img: string[]
	wasInUsed: boolean
}

const SelectedProductImages = forwardRef((props: ProductImages, ref) => {
	const [selectedImage, setSelectedImage] = useState<string>(props.img[0])
	const [countImgSlide, setCountImgSlide] = useState<number>(7)

	const handleImageClick = (imageUrl: string) => {
		setSelectedImage(imageUrl)
	}

	useImperativeHandle(ref, () => handleImageClick)

	function calculateCountImg(): 7 | 5 | 4 {
		const windowWidth: number = window.innerWidth
		return windowWidth >= 1100
			? 7
			: windowWidth >= 768
			? 5
			: windowWidth >= 500
			? 7
			: 4
	}

	useEffect(() => {
		window.scrollTo({
			top: 0,
		})

		function handleResizeCountImg() {
			setCountImgSlide(calculateCountImg())
		}
		handleResizeCountImg()
		window.addEventListener('resize', handleResizeCountImg)

		return () => {
			window.removeEventListener('resize', handleResizeCountImg)
		}
	}, [])

	return (
		<>
			<link
				rel='stylesheet'
				type='text/css'
				charSet='UTF-8'
				href='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css'
			/>
			<link
				rel='stylesheet'
				type='text/css'
				href='https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css'
			/>
			<div className={'container-main-img-product'}>
				<Image
					className={'main-img-product'}
					alt='main_image_product'
					quality={70}
					priority={true}
					placeholder='blur'
					blurDataURL={selectedImage}
					width={630} 
					height={630} 
					src={selectedImage}
				/>
			</div>
			<div className={'container-gallery-img'}>
				<Slider
					{...{
						infinite: false,
						speed: 500,
						slidesToShow: countImgSlide,
						slidesToScroll: 3,
						arrows: true,
						draggable: false,
					}}
				>
					{props.img.map((image, index) => (
						<Image
							key={index}
							src={image}
							width={68}
							height={80}
							alt={`thumbnail-${index}`}
							className={'gallery-img-item'}
							onClick={() => handleImageClick(image)}
						/>
					))}
				</Slider>
			</div>
			{props.wasInUsed ? (
				<div className={'img-product-isActive'}>товар Б/У</div>
			) : (
				''
			)}
		</>
	)
})

export default SelectedProductImages

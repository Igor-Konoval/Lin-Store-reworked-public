import React, { FC } from 'react'
import '@/styles/SelectedFilter.css'
import Image from 'next/image'
import { ISelectedFilter } from '@/types/IFilter'

const SelectedFilter: FC<ISelectedFilter> = ({
	title,
	prices,
	sortTitle,
	removeValue,
}) => {
	return (
		<div
			onClick={removeValue}
			className='d-flex justify-content-between align-items-center flex-nowrap container-selectedFilter selectedFilter-item'
		>
			<h2 className='mx-1 my-0 fs-6'>
				{sortTitle && sortTitle}
				{title && title}
				{prices && `${prices.minPrice} грн - ${prices.maxPrice} грн`}
			</h2>
			<Image
				width={16}
				height={16}
				src={process.env.NEXT_PUBLIC_API_URL + 'icons8-close-24.png'}
				alt='close icon'
			/>
		</div>
	)
}

export default SelectedFilter

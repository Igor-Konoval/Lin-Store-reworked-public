'use client'

import '@/styles/DropdownPrice.css'
import type { TypeDropdownPriceProps } from '@/types/IFilter'
import Image from 'next/image'
import { FC, useState } from 'react'
import { Col, Dropdown, Row } from 'react-bootstrap'
import { usePriceContext } from '../contexts/PriceContext/PriceContextProvider'
import RangeSelect from './RangeSelect'
import SelectedFilter from './SelectedFilter'

const DropdownPrice: FC<TypeDropdownPriceProps> = ({
	minPrice,
	maxPrice,
	onPriceChange,
	removeValue,
}) => {
	const fixedPrices = usePriceContext()?.price?.fixedPrices
	const [rangeWidth, setRangeWidth] = useState<number>(0)

	const checkPrice = () => {
		if (fixedPrices.maxPrice === null || fixedPrices.minPrice === null) {
			return true
		}
		if (maxPrice === null || minPrice === null) {
			return true
		}
		if (minPrice === 0 && maxPrice === 0) {
			return true
		}
		return fixedPrices.maxPrice == maxPrice && fixedPrices.minPrice == minPrice
	}
	return (
		<Col className='my-auto'>
			<Dropdown className='container-dropdownPrice-toggle'>
				<Dropdown.Toggle className='dropdownPrice-toggle'>
					Ціна
					<Image
						className='dropdown-toggle-img'
						alt='icon_dropdown'
						width={19}
						height={19}
						src={process.env.NEXT_PUBLIC_API_URL + 'dollar.png'}
					/>
				</Dropdown.Toggle>
				{!checkPrice() && (
					<SelectedFilter
						removeValue={removeValue}
						prices={{ minPrice, maxPrice }}
					/>
				)}
				<Dropdown.Menu className='dropdownMenu-content'>
					<Row className='rangeSelect-container'>
						<Col>
							<RangeSelect
								minPrice={minPrice}
								maxPrice={maxPrice}
								onPriceChange={onPriceChange}
								onWidthChange={setRangeWidth}
							/>
						</Col>
					</Row>
				</Dropdown.Menu>
			</Dropdown>
		</Col>
	)
}

export default DropdownPrice

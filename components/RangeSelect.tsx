'use client'
import '@/styles/RangeSelect.css'
import { IRangeProps } from '@/types/IProduct'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { FC, useEffect, useState } from 'react'
import { Form, Row } from 'react-bootstrap'
import { usePriceContext } from '../contexts/PriceContext/PriceContextProvider'

const RangeSelect: FC<IRangeProps> = ({
	minPrice,
	maxPrice,
	onPriceChange,
	onWidthChange,
}) => {
	const { price } = usePriceContext()
	const [minValue, setMinValue] = useState(minPrice)
	const [maxValue, setMaxValue] = useState(maxPrice)
	const [widthMin, setWidthMin] = useState(0)
	const [widthMax, setWidthMax] = useState(0)
	const [width, setWidth] = useState(0)

	useEffect(() => {
		const totalWidth: number = widthMin + widthMax + width + 45
		onWidthChange(totalWidth)
	}, [width, onWidthChange])

	useEffect(() => {
		setMinValue(minPrice)
		setMaxValue(maxPrice)
	}, [minPrice, maxPrice])

	const handleSliderChange = (values: number[] | number): void => {
		if (Array.isArray(values)) {
			setMinValue(values[0])
			setMaxValue(values[1])
		}
	}

	const handleSliderAfterChange = (values: number[] | number): void => {
		if (Array.isArray(values)) {
			onPriceChange(values[0], values[1])
		}
	}

	return (
		<>
			<Row className='d-flex align-items-center justify-content-center flex-nowrap flex-row'>
				<Form.Control
					type='number'
					className='no-arrows input-price'
					ref={(el: HTMLInputElement) => el && setWidthMin(el.offsetWidth)}
					min={price.prices.minPrice}
					max={price.prices.maxPrice}
					value={minValue}
					placeholder={`${price.prices.minPrice}`}
					onChange={e => {
						setMinValue(Number(e.target.value))
						onPriceChange(Number(e.target.value), maxValue)
					}}
					style={{ width: 55 }}
				/>
				<div
					className='slider-container'
					ref={(el: HTMLDivElement) => el && setWidth(el.offsetWidth)}
				>
					<Slider
						range
						allowCross={false}
						value={[minValue, maxValue]}
						min={price.fixedPrices.minPrice}
						max={price.fixedPrices.maxPrice}
						defaultValue={[minValue, maxValue]}
						onChange={handleSliderChange}
						onChangeComplete={handleSliderAfterChange}
					/>
				</div>
				<Form.Control
					type='number'
					className='input-price'
					min={price.prices.minPrice}
					max={price.prices.maxPrice}
					ref={(el: HTMLInputElement) => el && setWidthMax(el.offsetWidth)}
					value={maxValue}
					placeholder={`${price.prices.maxPrice}`}
					onChange={e => {
						setMaxValue(Number(e.target.value))
						onPriceChange(minValue, Number(e.target.value))
					}}
					style={{ width: 55 }}
				/>
			</Row>
		</>
	)
}

export default RangeSelect

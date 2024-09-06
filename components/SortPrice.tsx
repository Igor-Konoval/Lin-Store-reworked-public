import SelectedFilter from './SelectedFilter'
import '@/styles/SortPrice.css'
import { FC } from 'react'
import { Col, Dropdown } from 'react-bootstrap'
import type { ISortPrice } from '@/types/IFilter'
import Image from 'next/image'

const sortValue: string[] = [
	'від низької',
	'від високої',
	'за купленими',
	'за відгуками',
]

const SortPrice: FC<ISortPrice> = ({
	selectSortPrice,
	removeSortPrice,
	changeSortPrice,
}) => {
	return (
		<Col>
			<Dropdown className='container-sortPrice-toggle'>
				<Dropdown.Toggle className='sortPrice-toggle'>
					Сортувати
					<Image
						className='sortPrice-img'
						src={
							process.env.NEXT_PUBLIC_API_URL + 'icons8-sort-by-price-100.png'
						}
						alt='icon_sort'
						width={19}
						height={19}
					/>
				</Dropdown.Toggle>
				{selectSortPrice && (
					<SelectedFilter
						removeValue={removeSortPrice}
						sortTitle={selectSortPrice}
					/>
				)}
				<Dropdown.Menu>
					{sortValue.map(value => (
						<Dropdown.Item
							onClick={() => {
								changeSortPrice(value)
							}}
							key={value}
						>
							{value}
						</Dropdown.Item>
					))}
				</Dropdown.Menu>
			</Dropdown>
		</Col>
	)
}

export default SortPrice

'use client'
import '@/styles/FilterItem.css'
import Image from 'next/image'
import SelectedFilter from './SelectedFilter'
import React, { useState, FC } from 'react'
import { Col, Dropdown, Form } from 'react-bootstrap'
import type { TypeFiltrationProps } from '@/types/IFilter'

const FilterItem: FC<TypeFiltrationProps> = ({
	typeFilter,
	title,
	onSelect,
	selectValue,
	removeValue,
}) => {
	const CustomToggle = React.forwardRef(
		(
			{
				children,
				onClick,
			}: {
				children: React.ReactNode
				onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
			},
			ref: React.ForwardedRef<HTMLButtonElement>
		) => (
			<button
				className='d-flex flex-row flex-nowrap align-items-center btn filterItem-a'
				ref={ref}
				onClick={e => {
					e.preventDefault()
					onClick(e)
				}}
			>
				{children}
			</button>
		)
	)

	const CustomMenu = React.forwardRef(
		(
			{
				children,
				style,
				className,
				'aria-labelledby': labeledBy,
			}: {
				children: React.ReactNode
				style: {}
				className: string
				['aria-labelledby']: string
			},
			ref: React.ForwardedRef<HTMLDivElement>
		) => {
			const [value, setValue] = useState('')

			return (
				<div
					ref={ref}
					style={style}
					className={className}
					aria-labelledby={labeledBy}
				>
					<Form.Control
						className='mx-3 my-2 w-auto'
						placeholder='Знайти...'
						onChange={e => setValue(e.target.value)}
						value={value}
					/>
					<ul className='list-unstyled'>
						{React.Children.toArray(children).filter(
							(child: any) =>
								!value || child.props.children.toLowerCase().startsWith(value)
						)}
					</ul>
				</div>
			)
		}
	)

	return (
		<Col>
			<Dropdown className='container-filterItem'>
				<Dropdown.Toggle as={CustomToggle} id='dropdown-custom-components'>
					{title}
					<Image
						className='filterItem-img'
						src={process.env.NEXT_PUBLIC_API_URL + 'list.png'}
						alt='icon_list'
						width={30}
						height={30}
					/>
				</Dropdown.Toggle>
				{selectValue.name !== 'Категории' ? (
					selectValue.name !== 'Бренды' ? (
						<SelectedFilter
							removeValue={removeValue}
							title={selectValue.name}
						/>
					) : (
						''
					)
				) : (
					''
				)}

				<Dropdown.Menu as={CustomMenu}>
					{typeFilter.map(filtration => (
						<Dropdown.Item
							onClick={() => onSelect(filtration)}
							key={filtration._id}
							eventKey={filtration._id || undefined}
						>
							{filtration.name}
						</Dropdown.Item>
					))}
				</Dropdown.Menu>
			</Dropdown>
		</Col>
	)
}

export default FilterItem

'use client'
import React, { FC, useMemo, useState } from 'react'
import CreateBrand from './CreateBrand'
import CreateType from './CreateType'
import CreateProduct from './CreateProduct'
import { Button } from 'react-bootstrap'

const Admin: FC = () => {
	const [brandVisible, setBrandVisible] = useState(false)
	const [typeVisible, setTypeVisible] = useState(false)
	const [productVisible, setProductVisible] = useState(false)

	const memoCreateBrand = useMemo(
		() => (
			<CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)} />
		),
		[brandVisible]
	)
	const memoCreateType = useMemo(
		() => (
			<CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />
		),
		[typeVisible]
	)
	const memoCreateProduct = useMemo(
		() => (
			<CreateProduct
				show={productVisible}
				onHide={() => setProductVisible(false)}
			/>
		),
		[productVisible]
	)

	return (
		<>
			<Button
				style={{ borderRadius: 50 }}
				variant='outline-dark'
				size='lg'
				onClick={() => setBrandVisible(true)}
			>
				Добавить брэнд
			</Button>
			<Button
				style={{ borderRadius: 50 }}
				variant='outline-dark'
				size='lg'
				onClick={() => setTypeVisible(true)}
			>
				Добавить тип
			</Button>
			<Button
				style={{ borderRadius: 50 }}
				variant='outline-dark'
				size='lg'
				onClick={() => setProductVisible(true)}
			>
				Добавить продукт
			</Button>
			{memoCreateBrand}
			{memoCreateType}
			{memoCreateProduct}
		</>
	)
}

export default Admin

'use client'
import { getAuthOldViews } from '@/services/productAPI'
import { useSession } from 'next-auth/react'
import { FC, useEffect, useState } from 'react'
import { useViewedListContext } from '../contexts/ViewedListContext/ViewedListContextProvider'
import SmallLoadSpinner from './SmallLoadSpinner'
import OldViewsSlider from './ViewedListSlider'

const ViewedList: FC = () => {
	const [isLoad, setIsLoad] = useState(true)
	const { status } = useSession()

	const { products, setProducts } = useViewedListContext()

	useEffect(() => {
		if (status === 'authenticated') {
			if (products === null)
				(async () => {
					const products = await getAuthOldViews()
					setProducts(products)
				})()
		}
		setIsLoad(false)
	}, [status])

	if (isLoad) {
		return (
			<div className='mt-5'>
				<h1>Переглянуті товари</h1>
				<hr />
				<SmallLoadSpinner />
			</div>
		)
	}

	if (products === null) {
		return null
	} else if (products.length === 0) {
		return null
	}

	return (
		<div className='mt-5'>
			<h1>Переглянуті товари</h1>
			<hr />
			<OldViewsSlider products={products} />
		</div>
	)
}

export default ViewedList

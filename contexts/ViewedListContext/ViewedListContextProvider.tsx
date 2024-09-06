'use client'
import { IProduct } from '@/types/IProduct'
import React, { useState } from 'react'

type ViewedListTypeContext = {
	products: IProduct[] | null
	setProducts: React.Dispatch<React.SetStateAction<IProduct[] | null>>
	updateSaveList: (product: IProduct) => void
}

export const ViewedListContext =
	React.createContext<ViewedListTypeContext | null>(null)

export function useViewedListContext() {
	const context = React.useContext(ViewedListContext)
	if (!context) throw new Error('Use app viewed list context within provider!')
	return context
}

const ViewedListProvider = ({ children }: { children: React.ReactNode }) => {
	const [products, setProducts] = useState<IProduct[] | null>(null)

	const updateSaveList = (product: IProduct) => {
		setProducts(prevProducts => {
			if (!prevProducts) return [product]
			const updatedList = prevProducts.filter(p => p._id !== product._id)

			if (prevProducts.length >= 25) {
				updatedList.pop()
			}
			updatedList.unshift(product)
			return updatedList
		})
	}

	const value = {
		products,
		setProducts,
		updateSaveList,
	}

	return (
		<ViewedListContext.Provider value={value}>
			{children}
		</ViewedListContext.Provider>
	)
}

export default ViewedListProvider

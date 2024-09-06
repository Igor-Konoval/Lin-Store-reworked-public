'use client'
import { allPrices } from '@/types/IProduct'
import React, { useState } from 'react'

type TypePriceContext = {
	price: allPrices
	setPrice: React.Dispatch<React.SetStateAction<allPrices>>
}

export const PriceContext = React.createContext<TypePriceContext | null>(null)

export function usePriceContext() {
	const context = React.useContext(PriceContext)
	if (!context) throw new Error('Use app price context within provider!')
	return context
}

const PriceProvider = ({ children }: { children: React.ReactNode }) => {
	const [price, setPrice] = useState({
		prices: {
			minPrice: 0,
			maxPrice: 0,
		},
		fixedPrices: {
			minPrice: 0,
			maxPrice: 0,
		},
	} as allPrices)

	const value = {
		price,
		setPrice,
	}

	return <PriceContext.Provider value={value}>{children}</PriceContext.Provider>
}

export default PriceProvider

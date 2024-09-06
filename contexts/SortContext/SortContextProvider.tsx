'use client'
import type { TypeSortPrice } from '@/types/IFilter'
import React, { useState } from 'react'

type TypeSortContext = {
	sortPrice: TypeSortPrice
	setSortPrice: React.Dispatch<React.SetStateAction<TypeSortPrice>>
}

export const SortContext = React.createContext<TypeSortContext | null>(null)

export function useSortContext() {
	const context = React.useContext(SortContext)
	if (!context) throw new Error('Use app sort context within provider!')
	return context
}

const SortProvider = ({ children }: { children: React.ReactNode }) => {
	const [sortPrice, setSortPrice] = useState<TypeSortPrice>(null)

	const value = {
		sortPrice,
		setSortPrice,
	}

	return <SortContext.Provider value={value}>{children}</SortContext.Provider>
}

export default SortProvider

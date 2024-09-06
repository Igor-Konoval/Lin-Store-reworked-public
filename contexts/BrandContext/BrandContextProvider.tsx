'use client'
import { IFilter } from '@/types/IFilter'
import React, { useState } from 'react'

type TypeBrandContext = {
	brand: IFilter
	setBrand: React.Dispatch<React.SetStateAction<IFilter>>
}

export const BrandContext = React.createContext<TypeBrandContext | null>(null)

export function useBrandContext() {
	const context = React.useContext(BrandContext)
	if (!context) throw new Error('Use app brand context within provider!')
	return context
}

const BrandProvider = ({ children }: { children: React.ReactNode }) => {
	const [brand, setBrand] = useState<IFilter>({
		name: 'Бренды',
		_id: null,
	})

	const value = {
		brand,
		setBrand,
	}

	return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
}

export default BrandProvider

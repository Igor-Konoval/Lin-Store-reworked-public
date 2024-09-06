'use client'
import { IFilter } from '@/types/IFilter'
import React, { useState } from 'react'

type TypeTypeContext = {
	type: IFilter
	setType: React.Dispatch<React.SetStateAction<IFilter>>
}

export const TypeContext = React.createContext<TypeTypeContext | null>(null)

export function useTypeContext() {
	const context = React.useContext(TypeContext)
	if (!context) throw new Error('Use app brand context within provider!')
	return context
}

const TypeProvider = ({ children }: { children: React.ReactNode }) => {
	const [type, setType] = useState<IFilter>({
		name: 'Категории',
		_id: null,
	})

	const value = {
		type,
		setType,
	}

	return <TypeContext.Provider value={value}>{children}</TypeContext.Provider>
}

export default TypeProvider

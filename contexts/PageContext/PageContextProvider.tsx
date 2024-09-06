'use client'
import React, { useState } from 'react'

type TypePage = {
	currentPage: number
	totalPages: number
}

type TypePageContext = {
	pages: TypePage
	setPages: React.Dispatch<React.SetStateAction<TypePage>>
}

export const PageContext = React.createContext<TypePageContext | null>(null)

export function usePageContext() {
	const context = React.useContext(PageContext)
	if (!context) throw new Error('Use app page context within provider!')
	return context
}

const PageProvider = ({ children }: { children: React.ReactNode }) => {
	const [pages, setPages] = useState<TypePage>({
		currentPage: 1,
		totalPages: 1,
	})

	const value = {
		pages,
		setPages,
	}

	return <PageContext.Provider value={value}>{children}</PageContext.Provider>
}

export default PageProvider

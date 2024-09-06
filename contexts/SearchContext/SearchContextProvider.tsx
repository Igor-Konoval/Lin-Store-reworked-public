'use client'
import { escapeFunc } from '@/utils/serviceUtils'
import React, { useState } from 'react'

export type SearchType = {
	search: string
	setFilterSearch: (a: string) => void
}

export const SearchContext = React.createContext<SearchType | null>(null)

export function useSearchContext() {
	const context = React.useContext(SearchContext)
	if (!context) throw new Error('Use app search context within provider!')
	return context
}

const SearchProvider = ({ children }: { children: React.ReactNode }) => {
	const [search, setSearch] = useState('')

	const setFilterSearch = (arg: string): void => {
		const filteredValue = escapeFunc(arg)
		setSearch(filteredValue)
	}

	const value = {
		search,
		setFilterSearch,
	}

	return (
		<SearchContext.Provider value={value}>{children}</SearchContext.Provider>
	)
}

export default SearchProvider

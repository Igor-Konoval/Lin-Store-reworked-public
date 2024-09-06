export interface IFilter {
	_id: string | null
	name: string | null
}

export interface ISelectedFilter {
	title?: string | null
	prices?: IPrices
	sortTitle?: string | null
	removeValue: () => void
}

export interface IPrices {
	minPrice: number | null
	maxPrice: number | null
}

export type TypeFiltrationProps = {
	onSelect: (a: IFilter) => void //onSelect?: (a: IFilter) => void
	title: string
	typeFilter: IFilter[]
	selectValue: IFilter
	removeValue: () => void
}

export type TypeDropdownPriceProps = {
	minPrice: number
	maxPrice: number
	onPriceChange: (selectMinPrice: number, selectMaxPrice: number) => void
	removeValue: () => void
}

export type TypeSortPrice = string | null

export type ISortPrice = {
	selectSortPrice: TypeSortPrice
	removeSortPrice: () => void
	changeSortPrice: (value: string) => void
}

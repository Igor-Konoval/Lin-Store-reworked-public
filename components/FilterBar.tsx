import FilterComponent from './FilterComponent'

async function fetchFilters() {
	const data = await fetch(process.env.NEXT_PUBLIC_API_URL + 'filter').then(response =>
		response.json()
	)
	return data
}

export default async function FilterBar() {
	const filters = await fetchFilters()
	return <FilterComponent brands={filters.brands} types={filters.types} />
}

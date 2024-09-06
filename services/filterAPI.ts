export const fetchFilters = async () => {
	return await fetch(process.env.NEXT_PUBLIC_API_URL + 'filter').then(
		response => response.json()
	)
}

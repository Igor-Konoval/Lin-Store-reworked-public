import axios from 'axios'

export const shortSearch = async (searchTerm: string) => {
	const data = await axios.get(
		process.env.NEXT_PUBLIC_API_URL + 'search/shortSearch',
		{
			params: {
				q: searchTerm,
			},
		}
	)

	return data
}

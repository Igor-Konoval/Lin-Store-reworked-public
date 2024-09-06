export const escapeFunc = (value: any) => {
	const div = document.createElement('div')
	div.innerHTML = value
	return div.textContent || ''
}

export const validateEmail = (email: string) => {
	const re = /^[^\s@]+@gmail\.com$/

	return re.test(email)
}

export const pathSegments = (segments: string[]) => {
	const type = segments.find(segment => segment.startsWith('type='))
	const brand = segments.find(segment => segment.startsWith('brand='))
	const page = segments.find(segment => segment.startsWith('p='))
	const minPrice = segments.find(segment => segment.startsWith('minPrice='))
	const maxPrice = segments.find(segment => segment.startsWith('maxPrice='))
	const sortPrice = segments.find(segment => segment.startsWith('sortPrice='))
	const search = segments.find(segment => segment.startsWith('search='))

	const isValidType =
		type === undefined || type === 'type=' || ''
			? undefined
			: decodeURIComponent(type).split('=')[1]
	const isValidBrand =
		brand === undefined || brand === 'brand=' || ''
			? undefined
			: decodeURIComponent(brand).split('=')[1]
	const isValidPage =
		page === undefined || '' ? 1 : +decodeURIComponent(page).split('=')[1]
	const isValidMinPrice =
		minPrice === undefined || minPrice === 'minPrice=' || ''
			? undefined
			: decodeURIComponent(minPrice).split('=')[1]
	const isValidMaxPrice =
		maxPrice === undefined || maxPrice === 'maxPrice=' || ''
			? undefined
			: decodeURIComponent(maxPrice).split('=')[1]
	const isValidSortPrice =
		sortPrice === undefined || sortPrice === 'sortPrice=' || ''
			? undefined
			: decodeURIComponent(sortPrice).split('=')[1]
	const isValidSearch =
		search === undefined || search === 'search=' || ''
			? undefined
			: decodeURIComponent(search).split('=')[1]

	return {
		isValidType,
		isValidBrand,
		isValidPage,
		isValidMinPrice,
		isValidMaxPrice,
		isValidSortPrice,
		isValidSearch,
	}
}

export const createEventBlueError = (errorTitle: string, errorData: string) => {
	document.dispatchEvent(
		new CustomEvent('alertDismissible', {
			bubbles: true,
			cancelable: false,
			detail: {
				errorTitle: errorTitle,
				errorData: errorData,
			},
		})
	)
}

export const createEventRedError = (errorTitle: string, errorData: string) => {
	document.dispatchEvent(
		new CustomEvent('alertRedError', {
			bubbles: true,
			cancelable: false,
			detail: {
				errorTitle,
				errorData,
			},
		})
	)
}

export const getCookieValue = (cookie: string | null | undefined) => {
	if (cookie) {
		const value = cookie.slice(2)
		return decodeURIComponent(value)
	}
	return null
}

export class CustomAuthError extends Error {
	status: number
	data?: any

	constructor(status: number, message: any, data?: any) {
		super(message)
		this.status = status
		this.data = data
	}
}

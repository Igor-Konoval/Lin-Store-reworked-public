export function lengthShortDesc(shortDescription: string): string {
	if (shortDescription.length > 55) {
		return shortDescription.slice(0, 64) + '...'
	}
	return shortDescription
}

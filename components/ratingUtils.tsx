import Image from 'next/image'
import React from 'react'

export const checkRating = (rating: number) => {
	const maxRating = 5
	const reRating = Math.round(rating)

	const filledStar = (
		<Image
			key='filled'
			alt='filled_star'
			width={20}
			height={20}
			src={process.env.NEXT_PUBLIC_API_URL + 'fullstar.png'}
		/>
	)

	const emptyStar = (
		<Image
			key='empty'
			alt='empty_star'
			width={18}
			height={18}
			src={process.env.NEXT_PUBLIC_API_URL + 'star.png'}
		/>
	)

	const stars = []
	for (let i = 0; i < reRating; i++) {
		stars.push(<div key={`star-${i}`}>{filledStar}</div>)
	}

	for (let i = reRating; i < maxRating; i++) {
		stars.push(<div key={`star-${i}`}>{emptyStar}</div>)
	}

	return stars
}

'use client'
import { allPrices } from '@/types/IProduct'
import { FC, useEffect } from 'react'
import { usePriceContext } from '../contexts/PriceContext/PriceContextProvider'

const InitPrice: FC<{ allPrices: allPrices }> = ({ allPrices }) => {
	const { price, setPrice } = usePriceContext()

	useEffect(() => {
		if (!Object.is(price.fixedPrices, allPrices.fixedPrices)) {
			setPrice(allPrices)
		}
	}, [allPrices])

	return null
}
export default InitPrice

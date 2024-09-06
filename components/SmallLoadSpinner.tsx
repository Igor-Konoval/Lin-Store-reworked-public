import { FC } from 'react'
import '@/styles/LoadSpinner.css'

const SmallLoadSpinner: FC<{ title?: string }> = ({ title = '' }) => {
	return (
		<>
			<h1 className='fs-1 mt-4 mb-5'>{title}</h1>
			<div className='small-container-spinner'>
				<div className='load-spinner' />
			</div>
		</>
	)
}

export default SmallLoadSpinner

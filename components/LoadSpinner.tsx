import { FC } from 'react'
import '@/styles/LoadSpinner.css'

const LoadSpinner: FC<{ title?: string }> = ({ title = '' }) => {
	return (
		<>
			<h1 className='fs-1 mt-4 mb-5'>{title}</h1>
			<div className='container-spinner'>
				<div className='load-spinner'></div>
			</div>
		</>
	)
}

export default LoadSpinner

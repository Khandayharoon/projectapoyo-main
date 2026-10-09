import { LoaderIcon } from 'react-hot-toast'
import PropTypes from "prop-types"

const LoadingButton = ({ isSubmitting, className, children }) => {
	return (
		<button type='submit' className={`loading-btn ${className}`} disabled={isSubmitting}>
			{isSubmitting ? <><LoaderIcon /> Processing...</> : <>{children}</>}
		</button>
	)
}

LoadingButton.propTypes = {
	children: PropTypes.any,
	isSubmitting: PropTypes.bool,
	className: PropTypes.any
}

export default LoadingButton

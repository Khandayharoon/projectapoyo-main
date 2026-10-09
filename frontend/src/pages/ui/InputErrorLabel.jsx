import PropTypes from "prop-types"

const InputErrorLabel = ({ error }) => {
	if (error && error.message != undefined) {
		return <div className="label-error">{error?.message}</div>
	}

	return <></>
}

InputErrorLabel.propTypes = {
	error: PropTypes.object
}

export default InputErrorLabel

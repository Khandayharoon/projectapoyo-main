import PropTypes from "prop-types"
import { Helmet } from "react-helmet-async"
import { SITE_NAME } from "../../data/config"

const PageTitle = ({ children, actionButton }) => {
	return (
		<>
		<Helmet>
			<title>{children} | {SITE_NAME}</title>
		</Helmet>
			<div className="pageTitle">
				<h1>{children}</h1>
				{actionButton}
			</div>
		</>
	)
}


PageTitle.propTypes = {
	children: PropTypes.any.isRequired,
	actionButton: PropTypes.any,
}

export default PageTitle

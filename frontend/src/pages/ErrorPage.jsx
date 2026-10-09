import { Link } from "react-router-dom"

const ErrorPage = () => {
	return (
		<section className="error_404">
			<h1>404</h1>
			<p>Page not found</p>
			<Link to={"/dashboard"}>Go to Home</Link>
		</section>
	)
}

export default ErrorPage

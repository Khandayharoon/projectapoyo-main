import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useRecoilValue } from 'recoil';
import { Suspense } from 'react';
import { fetchingUserState, userProfileAuth } from '../../data/recoil-state';
import { MessageCircleMore } from 'lucide-react';
import Header from './Header';
import Fallback from './Fallback';

const Layout = () => {
	const { pathname } = useLocation();
	const userAuthenticated = useRecoilValue(userProfileAuth);
	const userFetching = useRecoilValue(fetchingUserState);

	// wait till data is loaded
	if (userFetching) {
		return <Fallback/>
	}

	// redirect if not authenticated
	if (!userAuthenticated && !["/", "/login", "/register", "/recover"].includes(pathname)) {
		return <Navigate to={"/login?__ref=e1"} />
	}

	// redirect if logged in
	if (userAuthenticated && ["/login", "/register", "/recover"].includes(pathname)) {
		return <Navigate to={"/dashboard?__ref=e1"} />
	}

	return (
		<>
			<Header />
			<main className='main-content'>
				<Suspense fallback={<Fallback />}>
					<Outlet />
				</Suspense>
			</main>

			{
				// userAuthenticated &&
				// <button className='ai_btn'>
				// 	<span>AI Sahayaka</span>
				// 	<MessageCircleMore />
				// </button>
			}

			<footer>
				<div>&copy; 2024 - All rights reserved</div>
				<div>Project by: <b>Team A16</b></div>
			</footer>
		</>
	)
}

export default Layout

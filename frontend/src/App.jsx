import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { lazy, useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { defaultUserState, fetchingUserState, userProfileAuthState } from './data/recoil-state';
import { apoyoApi } from './data/api-utils';
import { getAuthToken, unsetAuthToken } from './data/utils';

// import pages
import Layout from './pages/ui/Layout'

const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const RecoverPage = lazy(() => import("./pages/RecoverPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const PodcastsPage = lazy(() => import("./pages/PodcastsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const BlogsPage = lazy(() => import("./pages/BlogsPage"));
const ConsultantsPage = lazy(() => import("./pages/ConsultantsPage"));
const ExercisesPage = lazy(() => import("./pages/ExercisesPage"));
const BadgesPage = lazy(() => import("./pages/BadgesPage"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
// const ChatPage = lazy(() => import("./pages/ChatPage"));

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				path: '/',
				element: <LandingPage />
			},
			{
				path: '/login',
				element: <LoginPage />
			},
			{
				path: '/register',
				element: <RegisterPage />
			},
			{
				path: '/recover',
				element: <RecoverPage />
			},
			{
				path: '/dashboard',
				element: <DashboardPage />
			},
			{
				path: '/consultants',
				element: <ConsultantsPage />
			},
			{
				path: '/blog',
				element: <BlogsPage />
			},
			// {
			// 	path: '/chats',
			// 	element: <ChatPage threadId={74784} role={"patient"}/>
			// },
			{
				path: '/podcasts',
				element: <PodcastsPage />
			},
			{
				path: '/exercises',
				element: <ExercisesPage />
			},
			{
				path: '/badges',
				element: <BadgesPage />
			},
			{
				path: '/profile',
				element: <ProfilePage />
			},
			{
				path: '*',
				element: <ErrorPage />
			}
		]
	}
])

const App = () => {
	const setUserAuth = useRecoilState(userProfileAuthState)[1];
	const setUserFetching = useRecoilState(fetchingUserState)[1];

	// fetch current user profile, if logged in
	useEffect(() => {
		const fetchProfile = async () => {
			if (getAuthToken()) {
				try {
					const res = await apoyoApi.get("/profile/me");

					// set auth state
					setUserAuth({
						isAuthenticated: true,
						profile: res.data
					});
				} catch (error) {
					setUserAuth(defaultUserState);
					unsetAuthToken();
				} finally {
					setUserFetching(false);
				}
			} else {
				setUserFetching(false);
			}
		}

		fetchProfile()
	}, [setUserAuth, setUserFetching]);

	return (
		<>
			<RouterProvider router={router} />
			<Toaster />
		</>
	)
}

export default App

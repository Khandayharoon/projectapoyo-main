import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { MenuIcon, User, X } from 'lucide-react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userProfileAuth, userProfileAuthState, userProfileState } from '../../data/recoil-state';
import { unsetAuthToken } from '../../data/utils'
import { SITE_NAME, SITE_SLOGAN } from '../../data/config';
import toast from 'react-hot-toast';

const Header = () => {
	const [isOpen, setIsOpen] = useState(false);
	const userAuthenticated = useRecoilValue(userProfileAuth);
	const userProfile = useRecoilValue(userProfileState);
	const setUserAuth = useRecoilState(userProfileAuthState)[1];
	const navigate = useNavigate();

	// handle menu opening
	const handleMenu = () => {
		setIsOpen((prev) => !prev);
	}

	// handle logout
	const handleLogout = () => {
		unsetAuthToken();
		setUserAuth({
			isAuthenticated: false,
			profile: {}
		});
		toast.success("Logged out successfully");
		navigate("/?__rf");
	}

	return (
		<header>
			<Link to={userAuthenticated ? "/dashboard" : "/"} className='sitename'>
				<img src='/logo.jpg' className='header_logo' alt='Logo' />
				<div>
					<h2>{SITE_NAME}</h2>
					<p>{SITE_SLOGAN}</p>
				</div>
			</Link>
			<div className='main-nav'>
				<button onClick={handleMenu} className='nav-btn navicon'>
					{isOpen ? <X size={30} /> : <MenuIcon size={30} />}
				</button>
				<nav className={isOpen ? "show-menu" : undefined}>
					{
						userAuthenticated ?
							<>
								<NavLink to={"/consultants"}>Consultants</NavLink>
								<NavLink to={"/podcasts"}>Podcasts</NavLink>
								<NavLink to={"/exercises"}>Exercises</NavLink>
								<NavLink to={"/blog"}>Blog</NavLink>
							</>
							:
							<>
								<NavLink to={"/"}>Home</NavLink>
								<NavLink to={"/login"}>Login</NavLink>
								<NavLink to={"/register"}>Register</NavLink>
							</>
					}
				</nav>
				{
					userAuthenticated &&
					<button className='nav-btn'>
						<User />
						<div className='profile-menu'>
							<div>Welcome<br />{userProfile.fullname}</div>
							<NavLink to={"/profile"}>My Profile</NavLink>
							<NavLink to={"/badges"}>My Badges</NavLink>
							<a href='#' onClick={handleLogout}>Logout</a>
						</div>
					</button>
				}
			</div>
		</header>
	)
}

export default Header

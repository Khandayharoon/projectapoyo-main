import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useRecoilState } from 'recoil'

import { validation_auth_email, validation_auth_password } from '../data/validation'
import InputErrorLabel from './ui/InputErrorLabel'
import { apoyoApi } from '../data/api-utils'
import LoadingButton from './ui/LoadingButton'
import { userProfileAuthState } from '../data/recoil-state'
import { randomString, setAuthToken } from '../data/utils'
import heroImage from "../assets/img/hero_meditation.webp";

const Login = () => {
	const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
	const setUserAuth = useRecoilState(userProfileAuthState)[1];
	const navigate = useNavigate();

	// handle form submission
	const handleLoginSubmit = async (formData) => {
		toast.dismiss();

		// fire login request
		try {
			const res = await apoyoApi.post("/auth/login", formData);

			// chech if profile data is received
			if (!res?.data?.profile) {
				throw new Error("Invalid server response")
			}

			// set state and token
			setAuthToken(randomString(32));
			setUserAuth({
				isAuthenticated: true,
				profile: res.data.profile
			});
			toast.success(res.data?.message || "Login successful");
			navigate("/dashboard?_ref=l")
		} catch (error) {
			toast.error(error?.response?.data?.error || error.message || "Unexpected error occured");
		}
	}

	return (
		<div className='login-container'>
			<div className='login-hero'>
				<img src={heroImage} />
			</div>
			<div className='login-form'>
				<h2 className='login-title'>
					<span className='gradient-text'>Login</span>
					<p>Authenticate yourself to use our portal</p>
				</h2>
				<form onSubmit={handleSubmit(handleLoginSubmit)} autoComplete='off' autoCapitalize='off'>
					<div className='form-group'>
						<label htmlFor="email">Email address</label>
						<input
							type='email'
							name='email'
							id='email'
							className='form-control'
							placeholder='Email address'
							autoComplete='email'
							required
							{...register("email", validation_auth_email)}
						/>
						<InputErrorLabel error={errors.email} />
					</div>

					<div className='form-group'>
						<label htmlFor="email">Password</label>
						<input
							type='password'
							name='password'
							id='password'
							className='form-control'
							placeholder='Password'
							autoComplete="current-password"
							required
							{...register("password", validation_auth_password)}
						/>
						<InputErrorLabel error={errors.password} />
					</div>

					<LoadingButton className="btn btn-dark btn-block" isSubmitting={isSubmitting}>Login</LoadingButton>
				</form>
				<div className='redir'>
					<p>
						<Link to={'/register'}>Sign up</Link>
						&nbsp; | &nbsp;
						<Link to={'/recover'}>Forgot password?</Link>
					</p>
				</div>
			</div>
		</div>
	)
}

export default Login

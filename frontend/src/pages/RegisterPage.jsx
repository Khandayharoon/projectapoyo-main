import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'

import { validation_auth_email, validation_auth_fullname, validation_auth_mobile } from '../data/validation'
import InputErrorLabel from './ui/InputErrorLabel'
import { apoyoApi } from '../data/api-utils'
import LoadingButton from './ui/LoadingButton'
import heroImage from "../assets/img/hero_meditation.webp";

const RegisterPage = () => {
	const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

	// handle form submission
	const handleLoginSubmit = async (formData) => {
		toast.dismiss();
		try {
			const res = await apoyoApi.post("/auth/register", formData);
			toast.success(res.data?.message || "Signup successful");
			reset();
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
					<span className='gradient-text'>Sign up</span>
					<p>Join our awesome mental wellness community</p>
				</h2>
				<form onSubmit={handleSubmit(handleLoginSubmit)} autoComplete='off' autoCapitalize='off'>
					<div className='form-group'>
						<label htmlFor="fullname">Fullname</label>
						<input
							type='text'
							name='fullname'
							id='fullname'
							className='form-control'
							placeholder='Fullname'
							autoComplete='fullname'
							required
							{...register("fullname", validation_auth_fullname)}
						/>
						<InputErrorLabel error={errors.fullname} />
					</div>

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
						<label htmlFor="mobile">Mobile number</label>
						<input
							type='number'
							name='mobile'
							id='mobile'
							className='form-control'
							placeholder='Mobile number'
							autoComplete='mobile'
							required
							{...register("mobile", validation_auth_mobile)}
						/>
						<InputErrorLabel error={errors.mobile} />

						<label htmlFor="role" className='check_label'>
							<input id='role' type="checkbox" {...register("consultant")} />
							<span>Signup as Doctor</span>
						</label>
					</div>

					<LoadingButton className="btn btn-dark btn-block" isSubmitting={isSubmitting}>Signup</LoadingButton>
				</form>
				<div className='redir'>
					<p>
						Already registered? <Link to={'/login'}>Sign in</Link>
					</p>
				</div>
			</div>
		</div>
	)
}

export default RegisterPage

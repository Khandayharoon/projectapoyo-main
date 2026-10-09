import toast from 'react-hot-toast';

import { validation_auth_password } from '../../data/validation';
import InputErrorLabel from '../ui/InputErrorLabel';
import { useForm } from 'react-hook-form';
import LoadingButton from '../ui/LoadingButton';
import { apoyoApi } from '../../data/api-utils';

const PasswordUpdate = () => {
	const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

	const onSubmit = async (data) => {
		try {
			await apoyoApi.post('/profile/password', data);
			reset();
			toast.success('Password updated successfully');
		} catch (error) {
			toast.error(error.response.data?.error || 'Failed to update password');
		}
	}

	return (
		<div className="pro_tab forms-tab">
			<h2 className="pro_title">Change Password</h2>

			<form onSubmit={handleSubmit(onSubmit)} autoComplete='off' autoCapitalize='off'>
				<div className="form-group">
					<label htmlFor="old_password">Current Password</label>
					<input type="password"
						name="old_password"
						id="old_password"
						className="form-control"
						placeholder='Current Password'
						autoComplete='password'
						required
						{...register('old_password', validation_auth_password)}
					/>
					<InputErrorLabel error={errors.old_password} />
				</div>
				<div className="form-group">
					<label htmlFor="new_password">New Password</label>
					<input type="password"
						name="new_password"
						id="new_password"
						placeholder='New Password'
						className="form-control"
						autoComplete='new-password'
						required
						{...register('new_password', validation_auth_password)}
					/>
					<InputErrorLabel error={errors.new_password} />
				</div>
				<LoadingButton className="btn btn-dark" isSubmitting={isSubmitting}>SUBMIT</LoadingButton>
			</form>
		</div>
	)
}

export default PasswordUpdate

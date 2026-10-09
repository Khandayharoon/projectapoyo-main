import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import toast from 'react-hot-toast';

import { validation_auth_dob, validation_auth_email, validation_auth_fullname, validation_auth_mobile } from "../../data/validation";
import InputErrorLabel from "../ui/InputErrorLabel";
import { userProfileAuthState } from "../../data/recoil-state";
import { apoyoApi } from '../../data/api-utils';
import LoadingButton from "../ui/LoadingButton";

const ProfileUpdate = () => {
	const [fullProfile, setProfile] = useRecoilState(userProfileAuthState);
	const profile = fullProfile.profile;


	const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
		defaultValues: {
			fullname: profile.fullname,
			email: profile.email,
			dob: profile.dob,
			mobile: profile.mobile,
			specialization: profile.public?.specialization,
			bio: profile.public?.bio,
			location: profile.public?.location,
			allow_messages: profile.allow_messages
		}
	});

	const onSubmit = async (data) => {
		try {
			const res = await apoyoApi.put('/profile/update', data);
			toast.success('Profile updated successfully');
			setProfile({ ...fullProfile, profile: { ...profile, ...res.data.profile } });
		} catch (error) {
			toast.error(error.response.data?.error || 'Failed to update profile');
		}
	}

	return (
		<div className="pro_tab forms-tab">
			<h2 className="pro_title">Update Profile</h2>

			<form onSubmit={handleSubmit(onSubmit)} autoComplete="off" autoCapitalize="off" autoCorrect="off">
				<div className="form-inline">
					<div className="form-group">
						<label htmlFor="fullname">Full Name</label>
						<input type="text"
							name="fullname"
							id="fullname"
							placeholder='Full Name'
							className="form-control"
							required
							{...register('fullname', validation_auth_fullname)}
						/>
						<InputErrorLabel error={errors.fullname} />
					</div>
					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input type="email"
							name="email"
							id="email"
							placeholder='Email'
							className="form-control"
							required
							{...register('email', validation_auth_email)}
						/>
						<InputErrorLabel error={errors.email} />
					</div>
					<div className="form-group">
						<label htmlFor="dob">Date of Birth</label>
						<input type="date"
							name="dob"
							id="dob"
							placeholder='Date of Birth'
							className="form-control"
							required
							{...register('dob', validation_auth_dob)}
						/>
						<InputErrorLabel error={errors.dob} />
					</div>
					<div className="form-group">
						<label htmlFor="mobile">Mobile</label>
						<input type="text"
							name="mobile"
							id="mobile"
							placeholder='Mobile'
							className="form-control"
							required
							{...register('mobile', validation_auth_mobile)}
						/>
						<InputErrorLabel error={errors.mobile} />
					</div>


					{
						profile.role === 'consultant' &&
						<>
							<div className="form-group">
								<label htmlFor="specialization">Specialization</label>
								<input type="text"
									name="specialization"
									id="specialization"
									placeholder='Specialization'
									className="form-control"
									required
									{...register('specialization', { required: true })}
								/>
								<InputErrorLabel error={errors.specialization} />
							</div>
							<div className="form-group">
								<label htmlFor="bio">Bio</label>
								<input
									type="text"
									name="bio"
									id="bio"
									placeholder='Bio'
									className="form-control"
									required
									{...register('bio', { required: true })}
								/>
								<InputErrorLabel error={errors.bio} />
							</div>
							<div className="form-group">
								<label htmlFor="location">Country</label>
								<input type="text"
									name="location"
									id="location"
									placeholder='Location'
									className="form-control"
									required
									{...register('location', { required: true })}
								/>
								<InputErrorLabel error={errors.location} />
							</div>
							<div className="form-group">
								<label htmlFor="allow_messages">Allow Messages</label>
								<select
									name="allow_messages"
									id="allow_messages"
									className="form-control"
									required
									defaultValue={profile.public?.allow_messages}
									{...register('allow_messages', { required: true })}
								>
									<option value="false">No</option>
									<option value="true">Yes</option>
								</select>
								<InputErrorLabel error={errors.allow_messages} />
							</div>
						</>
					}
				</div>

				<LoadingButton className="btn btn-dark" isSubmitting={isSubmitting}>SUBMIT</LoadingButton>
			</form>
		</div>
	)
}

export default ProfileUpdate

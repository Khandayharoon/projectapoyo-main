import PageTitle from "./ui/PageTitle";
import { useRecoilValue } from "recoil";
import { userProfileState } from "../data/recoil-state";
import { User, BriefcaseMedical } from "lucide-react";
import { dateFormat, dateFormat2 } from "../utils/date"
import { useState } from "react";
import PasswordUpdate from "./components/PasswordUpdate";
import ProfileUpdate from "./components/ProfileUpdate";

const ProfilePage = () => {
	const profile = useRecoilValue(userProfileState);
	const [currentPage, setCurrentPage] = useState("password");

	return (
		<>
			<PageTitle>Profile</PageTitle>

			<section className="profile_main">
				<div className="basic_info">
					<h2 className="pro_title">Basic Information</h2>
					{profile.role == "consultant" ? <BriefcaseMedical className="pro_avatar" /> : <User className="pro_avatar" />}

					<div>
						<table>
							<tbody>
								<tr>
									<td>Name</td>
									<td>{profile.fullname}</td>
								</tr>
								<tr>
									<td>Email</td>
									<td>{profile.email}</td>
								</tr>
								<tr>
									<td>Phone</td>
									<td>{profile.mobile}</td>
								</tr>
								<tr>
									<td>Birth date</td>
									<td>{profile.dob && dateFormat2(profile.dob)}</td>
								</tr>
								<tr>
									<td>Role</td>
									<td>{profile.role.toUpperCase()}</td>
								</tr>
								<tr>
									<td>Joined</td>
									<td>{dateFormat(profile.createdAt)}</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div className="pro_action">
						<button className="btn btn-dark" onClick={() => setCurrentPage("password")}>Change password</button>
						<button className="btn btn-dark" onClick={() => setCurrentPage("profile")}>Edit profile</button>
					</div>
				</div>

				{
					currentPage == "password" ? <PasswordUpdate /> : <ProfileUpdate />
				}

			</section>
		</>
	);
};

export default ProfilePage;
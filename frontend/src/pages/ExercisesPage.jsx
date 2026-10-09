import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useForm } from "react-hook-form";
import { toast } from 'react-hot-toast';
import { Calendar, User } from "lucide-react";

import PageTitle from "./ui/PageTitle";
import useGetApi from "../hooks/useApi";
import SkeletonLoader from './ui/SkeletonLoader';
import { userProfileAuthState } from "../data/recoil-state";
import { isAdminOrDoctor } from "../data/utils";
import AddBlogModal from "./modal/AddBlogModal";
import { apoyoApi } from "../data/api-utils";
import ViewBlogModal from "./modal/ViewBlogModal";
import { dateFormat } from "../utils/date";

const ExercisesPage = () => {
	const [userProfile, setUserProfile] = useRecoilState(userProfileAuthState);
	const { loading, data } = useGetApi('/exercise/all');
	const [currentExercise, setCurrentExercise] = useState(undefined);
	const [showAddModal, setShowAddModal] = useState(undefined);
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
	const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

	// handle add new post
	const handleAddPost = async (formData) => {
		try {
			const res = await apoyoApi.post("/exercise/create", formData);
			const newPost = res.data;
			data.unshift(newPost);
			reset();
			setShowAddModal(undefined);
			toast.success("Exercise added successfully");
		} catch (error) {
			toast.error(error.response?.data?.error || "Something went wrong");
		}
	}

	// handle mark as done
	const handleExerciseComplete = async () => {
		try {
			const res = await apoyoApi.post("/exercise/complete", { exercise_id: currentExercise._id });
			setUserProfile((prevState) => ({
				...prevState,
				profile: {
					...prevState.profile,
					completed_exercises: [...prevState.profile.completed_exercises, currentExercise._id],
				},
			}));

			if (res.data?.badge) {
				toast.success(`Exercise completed successfully.\nBadge unlocked: ${res.data?.badge}`);
			} else {
				toast.success(res.data?.message || "Exercise completed successfully");
			}
		} catch (error) {
			toast.error(error.response?.data?.error || "Something went wrong");
		}
	}

	// Debounce the searchTerm
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
		}, 300);
		return () => clearTimeout(handler)
	}, [searchTerm]);

	//--------------- searching -----------------
	const exerciseList = data ? data.filter(blog => blog.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) : [];
	const actionButton = isAdminOrDoctor(userProfile.profile) ? <button className="btn btn-dark" onClick={() => setShowAddModal(true)}>ADD</button> : undefined;

	return (
		<section className="blogs">
			<PageTitle actionButton={actionButton}>Exercises</PageTitle>
			<div className='podcast_search'>
				<input type="text" name='query' value={searchTerm} onChange={(e) => setSearchTerm(() => e.target.value)} placeholder="Search Blogs" className='form-control' />
			</div>

			{
				loading
					?
					<div className="blogs_all"><SkeletonLoader count={20} /></div>
					: (
						exerciseList && exerciseList.length > 0 ?
							<div className="blogs_all">
								{
									exerciseList.map((blog, idx) => (
										<div key={idx} className='item' onClick={() => setCurrentExercise(blog)}>
											<h3>{blog.title}</h3>
											<p>
												<User />
												<span>{blog.author?.fullname}</span>
												&nbsp; &nbsp;
												<Calendar />
												<span>{dateFormat(blog.createdAt)}</span>
											</p>
										</div>
									))
								}
							</div>
							:
							<h3>{debouncedSearchTerm.length == 0 ? "No exercises posted yet" : "No matching posts found"}</h3>
					)
			}

			{currentExercise && <ViewBlogModal
				blog={currentExercise}
				onClose={setCurrentExercise}
				handleExercise={handleExerciseComplete}
				type="exercise"
			/>}

			{showAddModal && <AddBlogModal
				onClose={setShowAddModal}
				onSubmit={handleAddPost}
				formOptions={{ register, isSubmitting, errors, handleSubmit, reset }}
				title={"Add New Exercise"}
			/>}
		</section>
	)
};

export default ExercisesPage;
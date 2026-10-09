import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useForm } from "react-hook-form";
import { toast } from 'react-hot-toast';
import { Calendar, User } from "lucide-react";

import PageTitle from "./ui/PageTitle";
import useGetApi from "../hooks/useApi";
import SkeletonLoader from './ui/SkeletonLoader';
import { userProfileState } from "../data/recoil-state";
import { isAdminOrDoctor } from "../data/utils";
import AddBlogModal from "./modal/AddBlogModal";
import { apoyoApi } from "../data/api-utils";
import ViewBlogModal from "./modal/ViewBlogModal";
import { dateFormat } from "../utils/date";

const Blogs = () => {
	const userProfile = useRecoilValue(userProfileState);
	const { loading, data } = useGetApi('/blog/all');
	const [currentBlog, setCurrentBlog] = useState(undefined);
	const [showAddModal, setShowAddModal] = useState(undefined);
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
	const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

	// handle add new post
	const handleAddPost = async (formData) => {
		try {
			const res = await apoyoApi.post("/blog/create", formData);
			const newPost = res.data;
			data.unshift(newPost);
			reset();
			setShowAddModal(undefined);
			toast.success("Post added successfully");
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
	const blogsList = data ? data.filter(blog => blog.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) : [];
	const actionButton = isAdminOrDoctor(userProfile) ? <button className="btn btn-dark" onClick={() => setShowAddModal(true)}>ADD</button> : undefined;


	return (
		<section className="blogs">
			<PageTitle actionButton={actionButton}>Blogs</PageTitle>
			<div className='podcast_search'>
				<input type="text" name='query' value={searchTerm} onChange={(e) => setSearchTerm(() => e.target.value)} placeholder="Search Blogs" className='form-control' />
			</div>

			{
				loading
					?
					<div className="blogs_all"><SkeletonLoader count={20} /></div>
					: (
						blogsList && blogsList.length > 0 ?
							<div className="blogs_all">
								{
									blogsList.map((blog, idx) => (
										<div key={idx} className='item' onClick={() => setCurrentBlog(blog)}>
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
							<h3>{debouncedSearchTerm.length == 0 ? "No blogs posted yet" : "No matching posts found"}</h3>
					)
			}

			{currentBlog && <ViewBlogModal blog={currentBlog} onClose={setCurrentBlog} />}
			{showAddModal && <AddBlogModal
				onClose={setShowAddModal}
				onSubmit={handleAddPost}
				formOptions={{ register, isSubmitting, errors, handleSubmit, reset }}
				title={"Add Blog Post"}
			/>}

		</section>
	)
};

export default Blogs;
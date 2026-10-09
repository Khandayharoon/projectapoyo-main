import { Calendar, CheckCheck, Tag, User } from 'lucide-react';
import ReactDOM from 'react-dom';
import { dateFormat } from '../../utils/date';
import { useRecoilValue } from 'recoil';
import { userProfileState } from '../../data/recoil-state';

const ViewBlogModal = ({ blog, onClose, type, handleExercise }) => {
	const userProfile = useRecoilValue(userProfileState);
	let exerciseActions = undefined;


	if (type === 'exercise') {
		const handleMarkDone = (e) => {
			e.target.disabled = true;
			handleExercise()
		}

		if (userProfile.completed_exercises.indexOf(blog._id) == -1) {
			exerciseActions = <div>
				<button onClick={handleMarkDone}>Mark as Done</button>
			</div>
		} else {
			exerciseActions = <div className='blog-done'>
				<CheckCheck />
				<span>Completed</span>
			</div>
		}
	}

	return ReactDOM.createPortal(
		<div className='podcast_modal'>
			<div className='podcast_content blog-full'>
				<div className='blog-full-inner'>
					<h2 className='blog-title'>{blog.title}</h2>
					<div className="info">
						<div>
							<User />
							<span>{blog.author?.fullname || "N/A"}</span>
						</div>
						<div>
							<Calendar />
							<span>{dateFormat(blog.createdAt)}</span>
						</div>
						<div>
							<Tag />
							<span>{blog.tag}</span>
						</div>
					</div>
					<p dangerouslySetInnerHTML={{ __html: atob(blog.content) }}></p>
				</div>
				<div className='close_btn'>
					<button onClick={() => onClose(undefined)}>CLOSE</button>
					{exerciseActions}
					{/* {
						blog.author._id === userProfile._id &&
						<div>
							<button>DELETE</button>
						</div>
					} */}
				</div>
			</div>
		</div>,
		document.getElementById('modal')
	)
}

export default ViewBlogModal

import ReactDOM from 'react-dom';
import InputErrorLabel from '../ui/InputErrorLabel';
import {Loader} from "lucide-react";

const AddBlogModal = ({ onClose, formOptions, onSubmit, title }) => {
	const { register, isSubmitting, errors, handleSubmit, reset } = formOptions;

	const handleModalClose = () => {
		reset();
		onClose(undefined);
	}
	return ReactDOM.createPortal(
		<div className='podcast_modal'>
			<div className='podcast_content blog-form'>
				<h2>{title}</h2>
				<form onSubmit={handleSubmit(onSubmit)} autoComplete='off' autoCapitalize='off'>
					<div className="form-group">
						<label htmlFor="title">Title</label>
						<input
							type="text"
							required
							className='form-control'
							placeholder='Title'
							{...register("title", { required: "Title is required" })}
						/>
						<InputErrorLabel error={errors.title} />
					</div>
					<div className="form-group">
						<label htmlFor="content">Content</label>
						<textarea
							required
							placeholder='Enter content here...'
							className='form-control'
							{...register("content", { required: "Content is required" })}
						></textarea>
						<InputErrorLabel error={errors.content} />
					</div>
					<div className="form-group">
						<label htmlFor="image">Tag</label>
						<input
							type="text"
							required
							className='form-control'
							{...register("tag", { required: "Tag is required" })}
						/>
						<InputErrorLabel error={errors.tag} />
					</div>
					<div className="form-group fg-flex">
						<button type="button" onClick={handleModalClose} className='btn btn-danger btn-block' disabled={isSubmitting}>Close</button>
						<button type="submit" className='btn btn-success btn-block' disabled={isSubmitting}>{isSubmitting ? <><Loader className='loading-spinner'/> Posting...</> : "Submit"}</button>
					</div>
				</form>
			</div>
		</div>,
		document.getElementById('modal')
	)
}

export default AddBlogModal

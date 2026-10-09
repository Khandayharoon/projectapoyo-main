import { Brain, MapPinHouseIcon, User } from 'lucide-react';
import ReactDOM from 'react-dom';

const ViewConsultantModal = ({ consultant, onClose }) => {
	return ReactDOM.createPortal(
		<div className='podcast_modal'>
			<div className='podcast_content doc-full'>
				<div className='doc-full-inner'>
					<h2>Consultant Profile</h2>
					<div className='doc-full-content'>
						<div className='doc_icon'>
							<User size={64} strokeWidth={1.5} />
						</div>
						<div className='doc_info'>
							<h3>{consultant.fullname}</h3>
							<div className='doc_bio'>{consultant.public?.bio}</div>
							<div className='doc_loc'>
								<p>
									<Brain />
									<span>{consultant.public?.specialization}</span>
								</p>
								<p>
									<MapPinHouseIcon />
									<span>{consultant.public?.location}</span>
								</p>
							</div>
						</div>

						{
							consultant.public?.allow_messages === "true" &&
							<button className='btn btn-dark btn-block'>START CHAT</button>
						}
					</div>
				</div>
				<div className='close_btn'>
					<button onClick={() => onClose(undefined)}>CLOSE</button>
				</div>
			</div>
		</div>,
		document.getElementById('modal')
	)
}

export default ViewConsultantModal

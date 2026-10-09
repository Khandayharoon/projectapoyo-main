import { Calendar } from 'lucide-react';
import ReactDOM from 'react-dom';
import { convertToIsoDate, dateFormat } from '../../utils/date';

const PodcastModal = ({ podcast, onClose }) => {
	return ReactDOM.createPortal(
		<div className='podcast_modal'>
			<div className='podcast_content'>
				<img src={podcast.imageUrl || "/logo.jpg"} alt="" className='podcast_cover skeleton_loader' loading='lazy' />
				<div className="podcast_name">
					{podcast.name}
					<div className='podcast_date'>
						<Calendar />
						<span>{dateFormat(convertToIsoDate(podcast.datePublished))}</span>
					</div>
				</div>
				<audio controls loading='lazy'>
					<source src={podcast.audioUrl} type="audio/mpeg" />
					Your browser does not support the audio element.
				</audio>
				<div className='close_btn'>
					<button onClick={() => onClose(undefined)}>CLOSE</button>
				</div>
			</div>
		</div>,
		document.getElementById('modal')
	)
}

export default PodcastModal

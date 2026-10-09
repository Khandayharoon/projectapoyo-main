import { useEffect, useState } from "react";
import { Brain, BriefcaseMedical, MapPinHouseIcon } from "lucide-react";

import PageTitle from "./ui/PageTitle";
import useGetApi from "../hooks/useApi";
import SkeletonLoader from './ui/SkeletonLoader';
import ViewConsultantModal from "./modal/ViewConsultantModal";

const ConsultationsPage = () => {
	const { loading, data } = useGetApi('/consultant/all');
	const [currentConsultant, setCurrentConsultant] = useState(undefined);
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

	// Debounce the searchTerm
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm?.toLowerCase());
		}, 300);
		return () => clearTimeout(handler)
	}, [searchTerm]);

	//--------------- searching -----------------
	const consultantList = data ? data.filter(consultant => {
		const name = consultant.fullname?.toLowerCase()
		const id = consultant._id;
		return name.includes(debouncedSearchTerm) || id.includes(debouncedSearchTerm)
	}) : [];

	return (
		<section className="docs">
			<PageTitle>Consultants</PageTitle>
			<div className='podcast_search'>
				<input type="text" name='query' value={searchTerm} onChange={(e) => setSearchTerm(() => e.target.value)} placeholder="Search Consultants" className='form-control' />
			</div>

			{
				loading
					?
					<div className="doc_all"><SkeletonLoader count={20} /></div>
					: (
						consultantList && consultantList.length > 0 ?
							<div className="doc_all">
								{
									consultantList.map((consultant, idx) => (
										<div key={idx} className='item' onClick={() => setCurrentConsultant(consultant)}>
											<div className="doc_icon">
												<BriefcaseMedical size={48} strokeWidth={1.5}/>
											</div>
											<div className="doc_info">
												<h3>{consultant.fullname}</h3>
												<div className="doc_bio">{consultant.public?.bio.substring(0, 60)}...</div>
												{}
												<div className="doc_loc">
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
										</div>
									))
								}
							</div>
							:
							<h3>{debouncedSearchTerm.length == 0 ? "No consultants registered yet" : "No matching consultants found"}</h3>
					)
			}

			{currentConsultant && <ViewConsultantModal consultant={currentConsultant} onClose={setCurrentConsultant} />}
		</section>
	)
};

export default ConsultationsPage;
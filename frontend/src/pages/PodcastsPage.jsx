import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import { TADDY_API_KEY, TADDY_USER_ID } from '../data/config';
import PageTitle from './ui/PageTitle';
import SkeletonLoader from './ui/SkeletonLoader';
import PodcastModal from './modal/PodcastModal';
import { Calendar } from 'lucide-react';
import { convertToIsoDate, dateFormat } from '../utils/date';

const PodcastsPage = () => {
	const [podcasts, setPodcasts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const [podcastModal, setPodcastModal] = useState(undefined);
	const [searchTerm, setSearchTerm] = useState('Mental Health');
	const searchRef = useRef(null);

	useEffect(() => {
		const fetchPodcasts = async () => {
			setLoading(true);
			setPodcastModal(() => undefined);

			const query = `query searchForTerm($term: String, $page: Int, $limitPerPage: Int, $filterForTypes: [TaddyType], $filterForCountries: [Country], $filterForLanguages: [Language], $filterForGenres: [Genre], $filterForSeriesUuids: [ID], $filterForNotInSeriesUuids: [ID], $isExactPhraseSearchMode: Boolean, $isSafeMode: Boolean, $searchResultsBoostType: SearchResultBoostType) {
				searchForTerm(term: $term, page: $page, limitPerPage: $limitPerPage, filterForTypes: $filterForTypes, filterForCountries: $filterForCountries, filterForLanguages: $filterForLanguages, filterForGenres: $filterForGenres, filterForSeriesUuids: $filterForSeriesUuids, filterForNotInSeriesUuids: $filterForNotInSeriesUuids, isExactPhraseSearchMode: $isExactPhraseSearchMode, isSafeMode: $isSafeMode, searchResultsBoostType:$searchResultsBoostType) {
				  searchId
				  podcastEpisodes {
					uuid
					guid
					name
					imageUrl
					audioUrl
					datePublished
					description (shouldStripHtmlTags: true)
				  }
				}
			  }`;

			// **Variables for the GraphQL query**
			const variables = {
				term: searchTerm,
				"filterForGenres": ["PODCASTSERIES_HEALTH_AND_FITNESS_MENTAL_HEALTH"],
				"limitPerPage": 20,
				"page": pageNumber

			};

			try {
				const response = await axios.post(
					'https://api.taddy.org/',
					{ query, variables },
					{
						headers: {
							'Content-Type': 'application/json',
							'X-USER-ID': TADDY_USER_ID,
							'X-API-KEY': TADDY_API_KEY
						}
					}
				);
				setPodcasts(response.data.data.searchForTerm.podcastEpisodes);
			} catch (error) {
				// catch error
			} finally {
				setLoading(false);
			}
		};
		fetchPodcasts();
	}, [pageNumber, searchTerm]);

	// handle
	const handlePodcastModal = (podcast) => {
		setPodcastModal(() => podcast);
	}

	// handle
	const handleSearchTermChange = (e) => {
		e.preventDefault();
		setSearchTerm(() => searchRef.current.value);
	}


	return (
		<section>
			<PageTitle>Podcasts</PageTitle>
			<form action='?__' method='post' className='podcast_search' onSubmit={handleSearchTermChange}>
				<input type="text" name='query' placeholder="Search Podcasts" className='form-control' ref={searchRef} />
				<button className='btn btn-dark'>Search</button>
			</form>
			<section className='podcasts_list'>
				{
					loading ?
						<SkeletonLoader count={20} />
						:
						(
							podcasts && podcasts.length > 0 ?
							<>
								{
									podcasts.map((podcast) => (
										<div key={podcast.uuid} className='item' onClick={() => handlePodcastModal(podcast)}>
											<img src={podcast.imageUrl || "/favicon.ico"} alt="Cover Image" loading='lazy' className='skeleton_loader' />
											<div className='content'>
												<h4>{podcast.name}</h4>
												<p dangerouslySetInnerHTML={{ __html: podcast.description.substr(0, 100) + "..." }}></p>
												<div className='info'>
													<Calendar/>
													<span>{dateFormat(convertToIsoDate(podcast.datePublished))}</span>
												</div>
											</div>
										</div>
									))
								}
							</>
							:
							<>
								<h4>No Podcasts Found</h4>
							</>
						)
				}
			</section>

			{podcastModal && !loading && <PodcastModal podcast={podcastModal} onClose={handlePodcastModal} />}

			{
				podcasts && podcasts.length > 0 &&
				<section className='pagination'>
					{
						Array(10)
							.fill()
							.map((_, idx) => <button className={pageNumber == idx + 1 ? "active" : undefined} key={idx} onClick={() => setPageNumber(idx + 1)}>{idx + 1}</button>)
					}
				</section>
			}
		</section>
	);
};

export default PodcastsPage;
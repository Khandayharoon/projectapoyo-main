import { Calendar } from "lucide-react";
import useGetApi from "../hooks/useApi";
import { dateFormat } from "../utils/date";
import PageTitle from "./ui/PageTitle";
import SkeletonLoader from "./ui/SkeletonLoader";
import { getBadgeData } from "../utils/badges";

const BadgesPage = () => {
	const { loading, data } = useGetApi("/profile/badges");
	
	return (<>
		<PageTitle>My Badges</PageTitle>
		{
			loading
				?
				<section className="badges_all">
					<SkeletonLoader count={10} />
				</section>
				: (
					data && data.length > 0 ?
						<section className="badges_all">
							{
								data.map((badge, key) => {
									const badgeInfo = getBadgeData(badge.level);

									return (
										<div key={key} className="badge_item">
											<div className="badge_icon">
												<h1>{badgeInfo[1]}</h1>
												<div className="badge_level">
													{badge.level}
												</div>
											</div>
											<div className="badge_info">
												<h3>{badgeInfo[0]}</h3>
												<p><Calendar /> &nbsp; {dateFormat(badge.date)}</p>
											</div>
										</div>)
								}
								)
							}
						</section>
						:
						<h3>You haven&apos;t earned any badges yet!</h3>
				)
		}
	</>)
};

export default BadgesPage;
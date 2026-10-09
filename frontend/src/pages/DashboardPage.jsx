import { getGreetingMessage } from '../utils/greetings'
import PageTitle from './ui/PageTitle'
import { useRecoilValue } from 'recoil'
import { userProfileState } from '../data/recoil-state'
import useGetApi from '../hooks/useApi'
import { Brain, Medal, MessageCircleMore, PencilRuler } from 'lucide-react'
import StatsBox from './ui/StatsBox'

const Dashboard = () => {
	const profile = useRecoilValue(userProfileState);
	const { data, loading } = useGetApi("/profile/dashboard");

	return (
		<>
			<PageTitle>Dashboard</PageTitle>
			<div className='dash_greeting'>
				{getGreetingMessage()}
				<h2>{profile.fullname}</h2>
			</div>

			<section className='dash_stats'>
				<StatsBox Icon={Brain} loading={loading} data={data?.exercises} title='Exercises' />
				<StatsBox Icon={Medal} loading={loading} data={data?.badges} title='Badges' />

				{
					profile.role === 'consultant' ?
						<StatsBox Icon={PencilRuler} loading={loading} data={data?.blogs} title='Blogs' />
						:
						<StatsBox Icon={MessageCircleMore} loading={loading} data={data?.chats} title='Chats' />
				}
			</section>

			<section className='dash_about'>
				<img src="/report_chart.svg" alt="Report" />
				<div>
					<h2>About us</h2>
					<p>APOYO is a mental health wellness platform designed to empower individuals in their journey toward emotional well-being. Recognizing the importance of mental health in today’s fast-paced world, APOYO offers a comprehensive solution that combines education, community support, and professional guidance.</p>
					<p>Through its user-friendly interface, APOYO provides access to insightful blogs and engaging podcasts on a wide range of mental health topics, enabling users to gain valuable knowledge and practical advice. The platform caters to both individuals seeking self-help resources and professionals offering therapy, fostering a supportive ecosystem for mental health.				</p>
					<p>APOYO’s vision is to break the stigma surrounding mental health by creating an inclusive space where users feel heard, supported, and empowered. Whether you&apos;re managing stress, coping with anxiety, or striving for a better quality of life, APOYO is your trusted companion on the path to mental well-being.</p>
				</div>
			</section>
		</>
	)
}

export default Dashboard

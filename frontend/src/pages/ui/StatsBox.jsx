import { Loader } from 'lucide-react';
import PropTypes from 'prop-types';

const StatsBox = ({ Icon, loading, data, title}) => {
	return (
		<div className='item'>
			<Icon className='icon' />
			<div className='info'>
				<h3>{title}</h3>
				<h1>{loading ? <Loader className='loading-spinner'/> : (data || 0)}</h1>
			</div>
		</div>
	)
};

StatsBox.propTypes = {
	Icon: PropTypes.any,
	loading: PropTypes.bool,
	data: PropTypes.any,
	title: PropTypes.string,
}

export default StatsBox

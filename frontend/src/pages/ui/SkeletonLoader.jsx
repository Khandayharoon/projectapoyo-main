const SkeletonLoader = ({ count }) => {

	return (
		<>
			{
				Array(count)
					.fill()
					.map((_, idx) => <div key={idx} className="skeleton_loader_box skeleton_loader"></div>)
			}
		</>
	)
}

export default SkeletonLoader

import { useState, useEffect, useCallback } from 'react';
import { apoyoApi } from '../data/api-utils';

const useGetApi = (url) => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	const fetchData = useCallback(async () => {
		try {
			const response = await apoyoApi.get(url);
			setData(response.data);
		} catch (err) {
			setError(err.message || 'Something went wrong');
		} finally {
			setLoading(false);
		}
	}, [url]);

	useEffect(() => {
		if(url){
			fetchData();
		}
	}, [url, fetchData]);

	return { data, error, loading, refetch: fetchData };
};

export default useGetApi;

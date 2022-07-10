import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Gets the query parameter of the current location
 * @returns {URLSearchParams} query of the current search
 */
export default function useQuery() {
	const { search } = useLocation();

	return useMemo(() => new URLSearchParams(search), [search]);
}

import React from 'react';
import { IoSearchOutline } from 'react-icons/io5';

export default function SearchButton({ size = '1em', view, selected}) {
	return (
		<div className={`sidebar-button ${selected ? 'selected' : ''}`} view={view}>
			<IoSearchOutline
				size={size}
				style={{ stroke: 'url(#base-gradient)' }}
			/>
		</div>
	);
}

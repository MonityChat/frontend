import React from 'react';
import { IoSearchOutline } from 'react-icons/io5';

export default function SearchButton({size = '1em'}) {
	return (
		<div className="sidebar-button">
			<IoSearchOutline
				size={size}
				style={{ stroke: 'url(#base-gradient)' }}
			/>
		</div>
	);
}
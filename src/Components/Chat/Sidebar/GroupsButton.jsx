import React from 'react';
import { IoPeopleOutline } from 'react-icons/io5';

export default function GroupsButton({size = '1em'}) {
	return (
		<div className="sidebar-button">
			<IoPeopleOutline
				size={size}
				style={{ stroke: 'url(#base-gradient)' }}
			/>
		</div>
	);
}

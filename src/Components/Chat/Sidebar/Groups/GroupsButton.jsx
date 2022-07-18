import React from 'react';
import { IoPeopleOutline } from 'react-icons/io5';

/**
 * Sidebarbutton to open the groupsview
 */
export default function GroupsButton({ size = '1em', view, selected }) {
	return (
		<div
			className={`sidebar-button ${selected ? 'selected' : ''}`}
			view={view}
		>
			<IoPeopleOutline
				size={size}
				style={{ stroke: 'url(#base-gradient)' }}
			/>
		</div>
	);
}

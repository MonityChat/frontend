import React from 'react';
import { IoPersonAddOutline } from 'react-icons/io5';

export default function AddContactsButton({ size = '1em', view, selected }) {
	return (
		<div
			className={`sidebar-button ${selected ? 'selected' : ''}`}
			view={view}
		>
			<IoPersonAddOutline
				size={size}
				style={{ stroke: 'url(#base-gradient)' }}
			/>
		</div>
	);
}

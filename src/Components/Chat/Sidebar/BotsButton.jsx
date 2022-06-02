import React from 'react';
import { BiBot } from 'react-icons/bi';

export default function AddContactsButton({ size = '1em', view, selected }) {
	return (
		<div
			className={`sidebar-button ${selected ? 'selected' : ''}`}
			view={view}
		>
			<BiBot size={size} style={{ fill: 'url(#base-gradient)' }} />
		</div>
	);
}

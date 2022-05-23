import React from 'react';
import { IoPersonAddOutline } from 'react-icons/io5';

export default function AddContactsButton({size = '1em'}) {
	return (
		<div className="sidebar-button">
			<IoPersonAddOutline
				size={size}
				style={{ stroke: 'url(#base-gradient)' }}
			/>
		</div>
	);
}
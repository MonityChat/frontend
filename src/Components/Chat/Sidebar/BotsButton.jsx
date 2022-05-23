import React from 'react';
import { BiBot } from 'react-icons/bi';

export default function AddContactsButton({ size = '1em' }) {
	return (
		<div className="sidebar-button">
			<BiBot
				size={size}
				style={{ fill: 'url(#base-gradient)'}}
			/>
		</div>
	);
}

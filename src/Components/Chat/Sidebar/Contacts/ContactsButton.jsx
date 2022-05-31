import React from 'react';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';

export default function ContactsButton({size = '1em'}) {
	return (
		<div className="sidebar-button">
			<IoChatbubbleEllipsesOutline
				size={size}
				style={{ stroke: 'url(#base-gradient)', fill: 'url(#base-gradient)' }}
			/>
		</div>
	);
}

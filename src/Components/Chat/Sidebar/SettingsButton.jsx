import React from 'react';
import { IoSettingsOutline } from 'react-icons/io5';

export default function SettingsButton({size = '1em'}) {
	return (
		<div className="sidebar-button">
			<IoSettingsOutline
				size={size}
				style={{ stroke: 'url(#base-gradient)' }}
			/>
		</div>
	);
}
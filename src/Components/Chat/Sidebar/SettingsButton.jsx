import React from 'react';
import { IoSettingsOutline } from 'react-icons/io5';

export default function SettingsButton({ size = '1em', view, selected }) {
	return (
		<div
			className={`sidebar-button ${selected ? 'selected' : ''}`}
			view={view}
		>
			<IoSettingsOutline
				size={size}
				style={{ stroke: 'url(#base-gradient)' }}
			/>
		</div>
	);
}

import React from 'react';

export default function SidebarButton({
	size = '3em',
	view,
	selected,
	icon,
	news,
}) {
	const Icon = icon;

	return (
		<div
			className={`sidebar-button ${selected ? 'selected' : ''} ${
				news ? 'news' : ''
			}`}
			view={view}
		>
			<Icon size={size} style={{ stroke: 'url(#base-gradient)',fill: 'url(#base-gradient)', }} />
		</div>
	);
}

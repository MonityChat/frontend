import React from 'react';

export default function SidbarButton({
	size = '1em',
	view,
	selected,
	children,
}) {
	return (
		<div
			className={`sidebar-button ${selected ? 'selected' : ''}`}
			view={view}
		>
		</div>
	);
}

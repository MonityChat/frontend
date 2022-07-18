import React from 'react';

export default function ChatInputIcon({ icon, size = '3rem', onClick, className }) {
	const Icon = icon;

	return (
		<>
			<Icon
				className={`chat-button ${className || ''}`}
				size={size}
				style={{
					fill: 'url(#base-gradient)',
					stroke: 'url(#base-gradient)',
				}}
				onClick={onClick}
			/>
		</>
	);
}

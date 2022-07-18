import React from 'react';

export default function Video({ src }) {
	return (
		<div className="video">
			<video controls src={src}></video>
		</div>
	);
}

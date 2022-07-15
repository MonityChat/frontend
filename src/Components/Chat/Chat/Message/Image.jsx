import React from 'react';
import { useRef } from 'react';

export default function Image({ src, alt }) {
	const imageRef = useRef();

	const reqeustFullScreen = () => {
		if (!document.fullscreenElement) {
			imageRef.current.requestFullscreen();
		} else {
			document.exitFullscreen();
		}
	};

	return (
		<img
			src={src}
			alt={alt}
			className="image-media"
			ref={imageRef}
			onClick={reqeustFullScreen}
		/>
	);
}

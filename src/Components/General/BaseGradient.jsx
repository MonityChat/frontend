import React from 'react';

/**
 * provides a gradient so svg's can use the url() with this id
 */
export default function BaseGradient() {
	return (
		<svg width="0" height="0">
			<linearGradient
				id="base-gradient"
				x1="100%"
				y1="100%"
				x2="0%"
				y2="0%"
			>
				<stop stopColor="var(--c-gradient-1)" offset="0%" />
				<stop stopColor="var(--c-gradient-2)" offset="100%" />
			</linearGradient>
		</svg>
	);
}

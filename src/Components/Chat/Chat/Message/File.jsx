import React from 'react';

export default function File({ src, name }) {
	return (
		<div className="file">
			<a href={src} target="blank">
				<AiOutlineFileText
					size={'clamp(2rem, 10vw ,5rem)'}
					fill="url(#base-gradient)"
				/>
			</a>
			<div className="file-name">{name}</div>
		</div>
	);
}

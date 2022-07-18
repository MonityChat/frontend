import React from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import './Css/MediaSelectBin.css';

export default function MediaSelectBin({ medias, onClick, className }) {
	return (
		<div className={`media-select-bin ${className}`}>
			{medias.map((media) => (
				<div className="media">
					<h4 className="media-name">{media.name}</h4>
					<div className="media-delete">
						<AiOutlineDelete
							onClick={() => onClick(media.name)}
							style={{
								fill: 'url(#base-gradient)',
							}}
						/>
					</div>
				</div>
			))}
		</div>
	);
}

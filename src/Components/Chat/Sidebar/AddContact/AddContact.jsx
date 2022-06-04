import React from 'react';
import './Css/AddContact.css';

export default function AddContact({ name, shortStatus, profilPicture, uuid }) {
	return (
		<div className="add-contact">
			<div className="profil-picture">
				<img src={profilPicture} alt="contact" />
			</div>
			<div className="info">
				<h2 className="name">{name}</h2>
				<span
					className={
						'short-status ' + (shortStatus.length > 37
							? 'ticker'
							: '')
					}
					style={{
						animationDuration: (shortStatus.length / 20) + 's'}}
				>
					{shortStatus}
				</span>
			</div>
		</div>
	);
}

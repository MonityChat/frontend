import React from 'react';

export default function ProfileButton({
	size = '1em',
	picture,
	view,
	selected,
}) {
	//for testing
	picture =
		'https://www.diethelmtravel.com/wp-content/uploads/2016/04/bill-gates-wealthiest-person.jpg';

	return (
		<div
			className={`sidebar-button ${selected ? 'selected' : ''}`}
			view={view}
		>
			<div className="circle" style={{ '--circle-size': size }}>
				<img src={picture} />
			</div>
		</div>
	);
}

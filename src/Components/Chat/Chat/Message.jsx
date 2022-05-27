import React from 'react';
import './Css/Message.css';

export default function Message({ you, author, time, children }) {
	return (
		<div className={'message ' + (you ? 'right' : 'left')}>
			<div className='information'>
				<h1 className="author">{author}</h1>
				<span className="time">{time}</span>
			</div>

			<p className="content">{children}</p>
		</div>
	);
}

import React from 'react';
import './Css/Message.css';
import { IoCheckmarkDone } from 'react-icons/io5';
import { IoMdHourglass, IoMdMore } from 'react-icons/io';

export default function Message({id, you, author, time, read, children }) {
	
	const handleMore = () => {
		alert(`More options for message ${id} selected`);
	};

	return (
		<div className={'message ' + (you ? 'right' : 'left')}>
			<div className="information">
				<div className="read">
					{read ? (
						<IoCheckmarkDone />
					) : (
						<IoMdHourglass size={'.75em'} />
					)}
				</div>
				<h1 className="author">{author}</h1>
				<div className="dot"></div>
				<span className="time">{formatTime(time)}</span>
			</div>

			<p className="content">{children}</p>
			<IoMdMore className='more' size={'1.5rem'} onClick={handleMore}/>
		</div>
	);
}

function formatTime(time) {
	const formatted = new Date(time).toLocaleTimeString();
	return formatted.slice(0, -3);
}

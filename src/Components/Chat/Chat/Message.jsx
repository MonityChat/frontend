import React, { useState } from 'react';
import './Css/Message.css';
import { IoCheckmarkDone, IoBookmarkOutline } from 'react-icons/io5';
import { IoMdHourglass, IoMdMore } from 'react-icons/io';
import { RiQuestionAnswerLine } from 'react-icons/ri';
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai';

export default React.forwardRef(function Message(
	{ uuid, you, author, time, read, children, moreOptions, onClick },
	ref
) {
	const [showMoreOptions, setShowMoreOptions] = useState(false);

	const handleAnswerClick = () => {
		console.log('answer');
	};

	const handleLikeClick = () => {
		console.log('like');
	};

	const handleDislikeClick = () => {
		console.log('dislike');
	};

	const handleBookmarkClick = () => {
		console.log('bookmark');
	};

	return (
		<div
			className={'message ' + (you ? 'right' : 'left')}
			onClick={() => onClick && onClick(uuid)}
			onMouseLeave={(e) =>
				setTimeout(() => setShowMoreOptions(false), 300)
			}
			ref={ref}
		>
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

			<div className="content">{children}</div>
			{moreOptions && !showMoreOptions ? (
				<IoMdMore
					className="more"
					size={'2rem'}
					onClick={() => setShowMoreOptions(true)}
				/>
			) : (
				''
			)}
			{showMoreOptions ? (
				<div
					className="more-options-menu"
					onClick={() => setShowMoreOptions(false)}
				>
					<RiQuestionAnswerLine
						size={'2rem'}
						onClick={handleAnswerClick}
					/>
					<AiOutlineLike size={'2rem'} onClick={handleLikeClick} />
					<AiOutlineDislike
						size={'2rem'}
						onClick={handleDislikeClick}
					/>
					<IoBookmarkOutline
						size={'2rem'}
						onClick={handleBookmarkClick}
					/>
				</div>
			) : (
				''
			)}
		</div>
	);
});

function formatTime(time) {
	const formatted = new Date(time).toLocaleTimeString();
	return formatted.slice(0, -3);
}

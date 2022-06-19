import React, { useState, useContext } from 'react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import './Css/Message.css';
import { IoCheckmarkDone, IoBookmarkOutline } from 'react-icons/io5';
import { IoMdHourglass, IoMdMore } from 'react-icons/io';
import { RiQuestionAnswerLine } from 'react-icons/ri';
import {
	WEBSOCKET_URL,
	ACTION_MESSAGE_DELETE,
	ACTION_MESSAGE_REACT,
	ACTION_MESSAGE_EDIT,
} from '../../../Util/Websocket';
import {
	AiOutlineLike,
	AiOutlineDislike,
	AiOutlineDelete,
	AiOutlineEye,
} from 'react-icons/ai';
import { RelatedContext } from './Chat';

export default React.forwardRef(function Message(
	{
		uuid,
		you,
		author,
		time,
		read,
		children,
		moreOptions,
		reactions,
		onClick,
	},
	ref
) {
	const [showMoreOptions, setShowMoreOptions] = useState(false);

	const { setRelated } = useContext(RelatedContext);

	const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
		share: true,
	});

	const handleAnswerClick = () => {
		setRelated(uuid);
	};

	const handleLikeClick = () => {
		console.log('like');
	};

	const handleDislikeClick = () => {
		console.log('dislike');
	};

	const handleBookmarkClick = () => {};

	const handleDeleteClick = () => {
		// sendJsonMessage({action: ACTION_MESSAGE_DELETE, })
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
					{read === 'READ' ? (
						<>
							<IoCheckmarkDone />
							<AiOutlineEye />
						</>
					) : read === 'RECEIVED' ? (
						<IoCheckmarkDone />
					) : (
						<IoMdHourglass size={'.75em'} />
					)}
				</div>
				<h1 className="author">{author}</h1>
				<div className="dot"></div>
				<span className="time">{formatTime(time)}</span>
			</div>

			<div className="content">
				{children}
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
						<AiOutlineLike
							size={'2rem'}
							onClick={handleLikeClick}
						/>
						<AiOutlineDislike
							size={'2rem'}
							onClick={handleDislikeClick}
						/>
						<IoBookmarkOutline
							size={'2rem'}
							onClick={handleBookmarkClick}
						/>
						<AiOutlineDelete
							size={'2rem'}
							onClick={handleDeleteClick}
						/>
					</div>
				) : (
					''
				)}
			</div>
		</div>
	);
});

function formatTime(time) {
	const formatted = new Date(time).toLocaleTimeString();
	return formatted.slice(0, -3);
}

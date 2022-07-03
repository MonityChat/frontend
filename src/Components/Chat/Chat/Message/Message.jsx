import React, { useState, useRef, useEffect } from 'react';
import { IoCheckmarkDone } from 'react-icons/io5';
import { IoMdHourglass, IoMdMore } from 'react-icons/io';
import { BsReply } from 'react-icons/bs';
import { MdOutlineAddReaction } from 'react-icons/md';
import { FaRegSave } from 'react-icons/fa';
import { AiOutlineDelete, AiOutlineEye, AiOutlineEdit } from 'react-icons/ai';
import ReactionContainer from './ReactionContainer';
import './Css/Message.css';

/**
 * Reg Ex to find URLs
 */
const URL_REGEX =
	/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gm;

/**
 * Component to display a message in the chat.
 * The details of the message will be given through props.
 * Depending on those, it will render the message correctly.
 * #It gets functions to call on certain events like editing a message.
 * The rendering on different sides is made with sometimes complex CSS
 * selectors and conditionally adding classes.
 */
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
		onClicks,
		index,
		message,
		edited,
	},
	ref
) {
	const [showMoreOptions, setShowMoreOptions] = useState(false);
	const [editing, setEditing] = useState(false);

	const messageTextRef = useRef();

	useEffect(() => {
		if (editing) messageTextRef.current.focus();
	}, [editing]);

	const saveEdit = () => {
		const newText = messageTextRef.current.innerText;
		setEditing(false);
		if (newText.length === 0) return;
		onClicks.onEdit && onClicks.onEdit(uuid, newText);
	};

	return (
		<div
			className={'message ' + (you ? 'right' : 'left')}
			onClick={() => onClicks.onMessage && onClicks.onMessage(index)}
			onMouseLeave={(e) => setShowMoreOptions(false)}
			ref={ref}
		>
			<div className="information">
				{edited && <AiOutlineEdit />}
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
				<div contentEditable={editing} ref={messageTextRef}>
					{linkify(message)}
				</div>
				{editing && (
					<div className="editing">
						<div className="save" onClick={saveEdit}>
							<div>Save</div>
							<FaRegSave
								size={'2rem'}
								style={{
									fill: 'url(#base-gradient)',
								}}
							/>
						</div>
					</div>
				)}

				<ReactionContainer reactions={reactions} />
				{moreOptions && !showMoreOptions ? (
					<IoMdMore
						className="more"
						size={'2rem'}
						onClick={() => setShowMoreOptions(true)}
					/>
				) : (
					''
				)}
				{showMoreOptions && (
					<div
						className="more-options-menu"
						onClick={() => setShowMoreOptions(false)}
					>
						<BsReply
							size={'2rem'}
							onClick={() =>
								onClicks.onRelate && onClicks.onRelate(uuid)
							}
						/>
						<MdOutlineAddReaction
							size={'2rem'}
							onClick={() =>
								onClicks.onReact && onClicks.onReact(uuid)
							}
						/>
						{you && (
							<>
								<AiOutlineDelete
									size={'2rem'}
									onClick={() =>
										onClicks.onDelete &&
										onClicks.onDelete(uuid)
									}
								/>
								<AiOutlineEdit
									size={'2rem'}
									onClick={() => setEditing((prev) => !prev)}
								/>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
});

/**
 * formats a timestamp so it will only display hours and minutes, seperated by a colon
 * @param {number} time timestamp in millis
 * @returns {string} the formatted time or 00:00 if it was a invalid timestamp
 */
function formatTime(time) {
	const date = new Date(time).toLocaleTimeString();

	return date === 'Invalid Date' ? '00:00' : date.slice(0, -3);
}

/**
 * Searches links in a given text and maps them to an a tag
 * @param {String} text to search for links
 * @returns {Array.<String>}
 */
function linkify(text) {
	return text.split(URL_REGEX).map((message) => {
		if (message.match(URL_REGEX)) {
			return (
				<a href={message} target="_blank">
					{message}
				</a>
			);
		} else {
			return message;
		}
	});
}

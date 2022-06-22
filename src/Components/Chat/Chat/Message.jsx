import React, { useState, useRef, useEffect } from 'react';
import { IoCheckmarkDone } from 'react-icons/io5';
import { IoMdHourglass, IoMdMore } from 'react-icons/io';
import { BsReply } from 'react-icons/bs';
import { MdOutlineAddReaction } from 'react-icons/md';
import { FaRegSave } from 'react-icons/fa';
import { AiOutlineDelete, AiOutlineEye, AiOutlineEdit } from 'react-icons/ai';
import './Css/Message.css';

/**
 * Dieser Komponente erzeugt eine chatnachricht.
 * Er bekommt die Nachrichten details als props und rendert die nachricht
 * davon abhängig.
 * zum Beispiel: ist "you == false" ist die nachricht nicht von dem eigen benutzer und
 * dem komponent wird die "left" klasse zugewiesen. Dadurch wird die nachricht auf der
 * linken seite angezeigt ( dies wird mit teileweise komplexeren css Selektoren realisiert).
 *
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
	},
	ref
) {
	const [showMoreOptions, setShowMoreOptions] = useState(false);
	const [editing, setEditing] = useState(false);

	const textRef = useRef();
	const editRef = useRef();

	useEffect(() => {
		if (editing) {
		} else {
		}
	}, [editing]);

	const saveEdit = () =>{
		const newText = editRef.current.value;
		setEditing(false);
		onClicks.onEdit && onClicks.onEdit(uuid, newText)
	}

	return (
		<div
			className={'message ' + (you ? 'right' : 'left')}
			onClick={() => onClicks.onMessage && onClicks.onMessage(index)}
			onMouseLeave={(e) => setShowMoreOptions(false)}
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
				{editing ? (
					<>
						<textarea ref={editRef}>{message}</textarea>
					</>
				) : (
					<div ref={textRef}>{message}</div>
				)}
				<div className="reaction-container">
					{reactions?.map((reaction) => (
						<div className="reaction">
							{String.fromCodePoint("0x" + reaction.reaction)}
							{reaction.count > 1 && (
								<span className="count">{reaction.count}</span>
							)}
						</div>
					))}
				</div>
				{moreOptions && !showMoreOptions ? (
					<IoMdMore
						className="more"
						size={'2rem'}
						onClick={() => setShowMoreOptions(true)}
					/>
				) : (
					''	
				)}
				{editing && (
					<FaRegSave
						className="save"
						size={'2rem'}
						style={{
							fill: 'url(#base-gradient)',
						}}
						onClick={saveEdit}
					/>
				)}
				{showMoreOptions ? (
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
						{/* <IoBookmarkOutline size={"2rem"} onClick={handleBookmarkClick} /> */}
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
				) : (
					''
				)}
			</div>
		</div>
	);
});

/**
 * Hilfsmethoden zum formatieren der Zeitangabe in einen String der nur Stunde und Minuten angibt.
 */
function formatTime(time) {
	const formatted = new Date(time).toLocaleTimeString();
	return formatted.slice(0, -3);
}

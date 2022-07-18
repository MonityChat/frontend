import React, { useState, useRef } from 'react';
import { IoPlay } from 'react-icons/io5';
import { IoMdPause } from 'react-icons/io';
import { MdMoreVert } from 'react-icons/md';
import './Css/Audio.css';

/**
 * Component for displaying audio files. It handles the start and stop and progress of the audio file.
 * It gives you another menu to open the
 * native audio player and to download it.
 */
export default function Audio({ src }) {
	const [paused, setPaused] = useState(false);

	const audioRef = useRef();
	const progressRef = useRef();

	const startStopAudio = () => {
		if (!paused) audioRef.current.play();
		else audioRef.current.pause();
		setPaused((prev) => !prev);
	};

	const calculateProgress = () => {
		const current = audioRef.current.currentTime;
		const duration = audioRef.current.duration;

		const percent = current / duration;
		progressRef.current.style.width = percent * 100 + '%';

		if (percent === 1) {
			setPaused(false);
		}
	};

	return (
		<div className="audio">
			<audio
				src={src}
				onTimeUpdate={calculateProgress}
				ref={audioRef}
			></audio>
			{!paused ? (
				<IoPlay
					size={'3rem'}
					style={{
						fill: 'url(#base-gradient)',
					}}
					onClick={startStopAudio}
				/>
			) : (
				<IoMdPause
					size={'3rem'}
					style={{
						fill: 'url(#base-gradient)',
					}}
					onClick={startStopAudio}
				/>
			)}
			<div className="progress-container">
				<div className="progress" ref={progressRef}></div>
			</div>
			<a href={src} target="blank">
				<MdMoreVert
					size={'2.5rem'}
					style={{
						fill: 'url(#base-gradient)',
					}}
				/>
			</a>
		</div>
	);
}

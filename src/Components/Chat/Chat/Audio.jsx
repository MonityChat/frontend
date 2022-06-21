import React, { useState, useRef } from 'react';
import { IoPlay } from 'react-icons/io5';
import { IoMdPause } from 'react-icons/io';
import { MdMoreVert } from 'react-icons/md';
import './Css/Audio.css';

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

		if(percent === 1){
			setPaused(false)
		}
	};

	return (
		<div className="audio">
			<audio
				src="/src/image/Aufnahme.mp3"
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
			<a href="/src/image/Aufnahme.mp3" target="blank">
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

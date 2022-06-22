import React from 'react';
import { Link } from 'react-router-dom';
import './Css/Home.css';
import { IoMdLogIn } from 'react-icons/io';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { MdMonitor } from 'react-icons/md';
import { RiOpenSourceLine } from 'react-icons/ri';
import { FaBolt } from 'react-icons/fa';
import BaseGradient from '../Chat/Sidebar/BaseGradient';

export default function Home() {
	return (
		<div class="home-container">
			<BaseGradient />
			<div class="monity-grid">
				<h1>Monity</h1>
				<div className="line"></div>
			</div>
			<div class="login">
				<IoMdLogIn
					size={'5rem'}
					style={{
						fill: 'url(#base-gradient)',
					}}
				/>
				<Link to="/authentication" className="link">
					chat now
				</Link>
			</div>
			<div class="fast">
				<FaBolt
					size={'4rem'}
					style={{
						fill: 'url(#base-gradient)',
					}}
				/>
				<div>F</div>
				<div>A</div>
				<div>S</div>
				<div>T</div>
			</div>
			<div class="opensource">
				<div>open source</div>
				<RiOpenSourceLine
					size={'8rem'}
					style={{
						fill: 'url(#base-gradient)',
					}}
				/>
			</div>
			<div class="messenger-for-all">
				<IoChatbubbleEllipsesOutline
					size={'5rem'}
					style={{
						fill: 'url(#base-gradient)',
						stroke: 'url(#base-gradient)',
					}}
				/>
				<div>Chat with anyone</div>
			</div>
			<div class="ui">
				<MdMonitor
					size={'2rem'}
					style={{
						fill: 'url(#base-gradient)',
					}}
				/>
				<div>simple and clean ui</div>
			</div>
		</div>
		// <div className="home">
		// 	<h1>Monity</h1>
		// 	<div className="line"></div>
		// 	<span>Fast and reliable messenger for everyone</span>
		// 	<span>
		// 		<Link to="/authentication" className="link">
		// 			chat now
		// 		</Link>
		// 	</span>
		// </div>
	);
}

import React from 'react';
import { Link } from 'react-router-dom';
import './Css/Home.css'

export default function Home() {
	return (
		<div className='home'>
			<h1>Monity</h1>
			<div className="line"></div>
			<span>Fast and reliable messenger for everyone</span>
			<span>
				<Link to="/authentication" className='link'>chat now</Link>
			</span>
			<span>
				or <a href="https://play.google.com/store/games" className='link'>download the app</a>
			</span>
		</div>
	);
}

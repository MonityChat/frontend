import React from 'react';
import { Link } from 'react-router-dom';
import './Css/FileNotFound.css';

export default function FileNotFound() {
	return (
		<div className="file-not-found inset-container">
			<h1>404</h1>
			<span>Sorry the page you are looking for doesn't exist</span>
			<Link to={'/home'}>
				<button> go back</button>
			</Link>
		</div>
	);
}

import React from 'react';
import { useHistory } from 'react-router-dom';
import './Css/FileNotFound.css';

export default function FileNotFound() {
	const history = useHistory();

	return (
		<div className="file-not-found inset-container">
			<h1>404</h1>
			<span>Sorry the page you are looking for doesn't exist</span>
			<button onClick={() => history.push('/home')}>go back</button>
		</div>
	);
}

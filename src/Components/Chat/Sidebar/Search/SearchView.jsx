import React, {useState} from 'react';
import './Css/SearchView.css';

export default function SearchView() {
	const [searchedGroups, setSearchedGroups] = useState([
	]);

	return (
		<div className="search-view">
			<h2 className="title">Search public groups</h2>
			<input
				type="text"
				className="search"
				placeholder="Search public groups"
			/>
		</div>
	);
}

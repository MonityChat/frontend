import React, { useState, useEffect } from 'react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import {
	ACTION_GROUP_SEARCH,
	ACTION_GROUP_ADD,
	WEBSOCKET_URL,
} from '../../../../Util/Websocket';
import './Css/SearchView.css';
import SearchGroup from './SearchGroup';

export default function SearchView() {
	const [searchedGroups, setSearchedGroups] = useState([]);

	const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
		share: true,
	});

	useEffect(() => {
		if (lastJsonMessage === null) return;
		if (lastJsonMessage.action !== ACTION_GROUP_SEARCH) return;

		setSearchedGroups(lastJsonMessage.content.groups);
	}, [lastJsonMessage]);

	const searchInputChanged = (e) => {
		searchInput(e.target.value);
	};

	const debunce = (cb, delay = 700) => {
		let timeout;

		return (...args) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				cb(...args);
			}, delay);
		};
	};

	const searchInput = debunce((keyword) => {
		if (keyword.length < 3) {
			searchedGroups([]);
			return;
		}

		sendJsonMessage({
			action: ACTION_GROUP_SEARCH,
			keyword,
		});
	});

	const sendJoinRequest = (uuid) => {
		console.log('sendJoinRequest', uuid);
		sendJsonMessage({
			action: ACTION_GROUP_ADD,
			target: uuid,
		});
	};

	return (
		<div className="search-view view">
			<h2 className="title">Search public groups</h2>
			<input
				type="text"
				className="search"
				placeholder="Search public groups"
				onChange={searchInputChanged}
			/>
			<div className="scrollable">
				{searchedGroups.length === 0 ? (
					<span className="placeholder">No results</span>
				) : (
					searchedGroups.map((groups, i) => (
						<SearchGroup
							key={i}
							// name={groups.name}
							// shortStatus={groups.shortStatus}
							// profilePicture={groups.profilePictureLocation}
							// uuid={groups.uuid}
							name={'Die Wilden'}
							shortStatus={'WILD AND FREE'}
							profilePicture={'/src/image/Donut.png'}
							uuid={'12323535'}
							onClick={sendJoinRequest}
						/>
					))
				)}
			</div>
		</div>
	);
}

import React, { useState, useEffect } from 'react';
import {
	ACTION_GROUP_SEARCH,
	ACTION_GROUP_ADD,
} from '../../../../Util/Websocket';
import './Css/SearchView.css';
import SearchGroup from './SearchGroup';
import useAction from './../../../../Hooks/useAction';
import { debounce } from './../../../../Util/Helpers';

/**
 * Component to render a sidebar view for searching groups.
 * currently not supported
 */
export default function SearchView() {
	const [searchedGroups, setSearchedGroups] = useState([]);

	const { sendJsonMessage } = useAction(
		ACTION_GROUP_SEARCH,
		(lastJsonMessage) => {
			setSearchedGroups(lastJsonMessage.content.groups);
		}
	);

	const searchInput = debounce((keyword) => {
		if (keyword.length < 3) {
			setSearchedGroups([]);
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
				onChange={(e) => searchInput(e.target.value)}
			/>
			<div className="scrollable">
			{searchedGroups.length === 0 ? (
					<span className="placeholder">No results</span>
				) : (
					searchedGroups.map((group, i) => (
						<AddContact
							name={group.userName}
							shortStatus={group.shortStatus}
							profilePicture={group.profileImageLocation}
							uuid={group.uuid}
							onClick={sendJoinRequest}
							key={i}
						/>
					))
				)}
			</div>
		</div>
	);
}

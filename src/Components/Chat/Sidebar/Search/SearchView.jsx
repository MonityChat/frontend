import React, { useState } from 'react';
import { ACTION } from '../../../../Util/Websocket';
import useAction from './../../../../Hooks/useAction';
import { debounce } from './../../../../Util/Helpers';
import './Css/SearchView.css';
import SearchGroup from './SearchGroup';

/**
 * Component to render a sidebar view for searching groups.
 * currently not supported
 */
export default function SearchView() {
	const [searchedGroups, setSearchedGroups] = useState([]);

	const { sendJsonMessage } = useAction(
		ACTION.GROUP.SEARCH,
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
			action: ACTION.GROUP.SEARCH,
			keyword,
		});
	});

	const sendJoinRequest = (uuid) => {
		sendJsonMessage({
			action: ACTION.GROUP.ADD,
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
						<SearchGroup
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

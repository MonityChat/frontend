import React from 'react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import {
	WEBSOCKET_URL,
	ACTION_CONTACT_DECLINE,
	ACTION_CONTACT_ADD,
} from '../../../../Util/Websocket';
import Request from './Request';
import './Css/RequestView.css';

export default function RequestView({ requests, removeRequest }) {
	const { sendJsonMessage } = useWebSocket(WEBSOCKET_URL, {
		share: true,
	});

	const onRequestConfirm = (uuid) => {
		handleRequest(uuid, ACTION_CONTACT_ADD);
	};

	const onRequestDecline = (uuid) => {
		handleRequest(uuid, ACTION_CONTACT_DECLINE);
	};

	const handleRequest = (uuid, action) => {
		sendJsonMessage({
			action: action,
			target: uuid,
		});
		removeRequest(uuid);
	};

	return (
		<div className="request-view view">
			<h2 className="title">Friend Requests</h2>
			<div className="scrollable">
				{requests.map((request, i) => (
					<Request
						name={request.userName}
						type={'contact'}
						profilePicture={request.profileImageLocation}
						uuid={request.uuid}
						key={i}
						onConfirm={onRequestConfirm}
						onDecline={onRequestDecline}
					/>
				))}
			</div>
		</div>
	);
}

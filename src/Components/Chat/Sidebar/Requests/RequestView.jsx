import React from 'react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { WEBSOCKET_URL, ACTION_CONTACT_DECLINE } from '../../../../Util/Websocket';
import Request from './Request';
import './Css/RequestView.css';

export default function RequestView({ requests }) {
	const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
		share: true,
	});

	const onRequestConfirm = (uuid) => {
		console.log('confirm request', uuid);
	};

	const onRequestDecline = (uuid) => {
		console.log('decline request', uuid);

    
	};

	return (
		<div className="request-view view">
			<h2 className="title">Friend Requests</h2>
			<div className="scrollable">
				{requests.map((request, i) => (
					<Request
						name={'Tom'}
						timestamp={Date.now()}
						key={i}
						onConfirm={onRequestConfirm}
						onDecline={onRequestDecline}
					/>
				))}
			</div>
		</div>
	);
}

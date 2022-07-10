import React from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import {
  ACTION
} from "../../../../Util/Websocket";
import Request from "./Request";
import "./Css/RequestView.css";
import useAction from './../../../../Hooks/useAction';

/**
 * Component to render a sidebar view for your request.
 * if a new request comes in, you will be abel to access
 * this view and see the request.
 */
export default function RequestView({ requests, removeRequest }) {
  const { sendJsonMessage } = useAction();

  const onRequestConfirm = (uuid) => {
    handleRequest(uuid, ACTION.CONTACT.ADD);
  };

  const onRequestDecline = (uuid) => {
    handleRequest(uuid, ACTION.CONTACT.DECLINE);
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
            type={"contact"}
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

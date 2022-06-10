import React, { useState, useEffect } from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import {
  ACTION_CONTACT_ADD,
  ACTION_CONTACT_SEARCH,
  WEBSOCKET_URL,
} from "../../../../Util/Websocket";
import AddContact from "./AddContact";
import "./Css/AddContactView.css";

export default function AddContactView() {
  const [searchedContacts, setSearchedContacts] = useState();

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
    share: true,
  });

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
    if (keyword.length < 3){
      setSearchedContacts([]);
      return;
    }

    sendJsonMessage({
      action: ACTION_CONTACT_SEARCH,
      keyword,
    });
  });

  const sendFriendRequest = (uuid) => {
    sendJsonMessage({
      action: ACTION_CONTACT_ADD,
      target: uuid,
    });
  };

  useEffect(() => {
    if (lastJsonMessage === null) return;
    if (lastJsonMessage.action !== ACTION_CONTACT_SEARCH) return;

    setSearchedContacts(lastJsonMessage.content.users);
  }, [lastJsonMessage]);

  return (
    <div className="add-contact-view view">
      <h2 className="title">Add contact</h2>
      <input
        type="text"
        className="search"
        placeholder="Search contact"
        onChange={searchInputChanged}
      />
      <div className="scrollable">
        {!searchedContacts ? (
          <span className="placeholder">No results</span>
        ) : (
          searchedContacts.map((contact, i) => (
            <AddContact
              name={contact.userName}
              shortStatus={contact.shortStatus}
              profilePicture={contact.profileImageLocation}
              uuid={contact.uuid}
              onClick={sendFriendRequest}
              key={i}
              // name={"Simon"}
              // shortStatus={"Crypto for life is Crypt for people who have "}
              // profilePicture={'/src/image/default.png'}
              // uuid={"123"}
              // onClick={sendFriendRequest}
              // key={i}
            />
          ))
        )}
      </div>
    </div>
  );
}

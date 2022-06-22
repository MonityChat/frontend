import React, { useState, useEffect } from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { toast } from "react-toastify";
import {
  ACTION_CONTACT_ADD,
  ACTION_CONTACT_SEARCH,
  WEBSOCKET_URL,
} from "../../../../Util/Websocket";
import AddContact from "./AddContact";
import "./Css/AddContactView.css";

export default function AddContactView() {
  const [searchedContacts, setSearchedContacts] = useState([]);

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
    if (keyword.length < 3) {
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
    switch (lastJsonMessage.action) {
      case ACTION_CONTACT_SEARCH: {
        setSearchedContacts(lastJsonMessage.content.users);
        break;
      }
      case ACTION_CONTACT_ADD: {
        if (lastJsonMessage.content.error === "ALREADY_MADE_CONTACT") {
          toast.error("You are already in contact");
        } else {
          toast.info("Sent friend request");
        }
      }
    }
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
        {searchedContacts.length === 0 ? (
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
              // name={'Simon'}
              // shortStatus={
              // 	'Crypto for life is Crypt for people who have '
              // }
              // profilePicture={'/src/image/Icon.png'}
              // uuid={'123'}
              // onClick={sendFriendRequest}
              // key={i}
            />
          ))
        )}
      </div>
    </div>
  );
}

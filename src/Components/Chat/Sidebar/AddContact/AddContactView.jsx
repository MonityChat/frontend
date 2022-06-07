import React, { useState, useEffect } from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { WEBSOCKET_URL } from "../../../../Util/Websocket";
import AddContact from "./AddContact";
import "./Css/AddContactView.css";

const ACTION_SEARCH_CONTACT = "contact:search";

export default function AddContactView() {
  const [searchedContacts, setSearchedContacts] = useState([]);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
    share: true,
  });

  const searchInput = (e) => {
    if (e.key !== "Enter") return;
    console.log("enter pressed");
    sendJsonMessage({
      action: ACTION_SEARCH_CONTACT,
      keyword: e.target.value,
    });
  };

  useEffect(() => {
    if (lastJsonMessage === null) return;
    if (lastJsonMessage.action !== ACTION_SEARCH_CONTACT) return;

    setSearchedContacts(lastJsonMessage.content.users);
  }, [lastJsonMessage]);

  return (
    <div className="add-contact-view">
      <h2 className="title">Add contact</h2>
      <input
        type="text"
        className="search"
        placeholder="Search contact"
        onKeyDown={searchInput}
      />
      {searchedContacts.map((contact, i) => (
        <AddContact
          name={"Test"}
          shortStatus={contact.shortStatus}
          profilePicture={contact.profileImageLocation}
          uuid={contact.uuid}
          key={i}
        />
      ))}
    </div>
  );
}

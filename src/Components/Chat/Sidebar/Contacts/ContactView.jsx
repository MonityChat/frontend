import React, { useEffect, useState, useContext } from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import Contact from "./Contact.jsx";
import {
  WEBSOCKET_URL,
  ACTION_CONTACT_GET,
  ACTION_GET_MESSAGE_LATEST,
} from "../../../../Util/Websocket.js";
import { ChatContext } from "../../Messenger";
import "./Css/ContactView.css";

export default function ContactView() {
  const [contacts, setContacts] = useState(null);

  const setSelectedChat = useContext(ChatContext);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
    share: true,
  });

  useEffect(() => {
    sendJsonMessage({
      action: ACTION_CONTACT_GET,
    });
  }, []);

  useEffect(() => {
    if (lastJsonMessage === null) return;
    if (lastJsonMessage.action !== ACTION_CONTACT_GET) return;

    const incomingContacts = lastJsonMessage.content.contacts;

    if (incomingContacts.length === 0) {
      setContacts([]);
    } else {
      incomingContacts
        .sort((a, b) => {
          return a.numberOfUnreadMessages - b.numberOfUnreadMessages;
        })
        .reverse();

      setContacts(incomingContacts);
    }
  }, [lastJsonMessage]);

  const onContactClick = (uuid) => {
    const chatId =
      contacts.find((contact) => contact.uuid === uuid).chatID || "";
    sendJsonMessage({
      action: ACTION_GET_MESSAGE_LATEST,
      chatID: chatId,
    });

    setSelectedChat(prev => ({...prev, chatId: chatId}));
    setSelectedChat(prev => ({...prev, targetId: uuid}));
  };

  return (
    <div className="contact-view view">
      <h2 className="title">Contacts</h2>
      <div className="scrollable">
        {contacts === null ? (
          <span className="placeholder">Loading data...</span>
        ) : contacts.length === 0 ? (
          <></>
        ) : (
          contacts.map((contact, i) => (
            <Contact
              key={i}
              uuid={contact.uuid}
              name={contact.userName}
              lastOnline={contact.lastSeen}
              profilPicture={contact.profileImageLocation}
              numberOfUnreadMessages={contact.unreadMessages}
              isBlocked={contact.isBlocked}
              lastMessage={contact.lastUnread.content}
              onClick={onContactClick}
              // uuid={'12345'}
              // name={'Tom'}
              // lastOnline={Date.now()}
              // profilPicture={'src/image/Donut.png'}
              // numberOfUnreadMessages={10}
              // isBlocked={false}
              // onClick={onContactClick}
            />
          ))
        )}
      </div>
    </div>
  );
}

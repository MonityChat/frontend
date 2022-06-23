import React, { useEffect, useState, useContext } from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { toast } from "react-toastify";
import Contact from "./Contact.jsx";
import {
  WEBSOCKET_URL,
  ACTION_CONTACT_GET,
  ACTION_GET_MESSAGE_LATEST,
  NOTIFICATION_MESSAGE_INCOMING,
  ACTION_PROFILE_GET_OTHER,
  NOTIFICATION_USER_ONLINE,
  NOTIFICATION_USER_UPDATE_PROFILE,
  NOTIFICATION_USER_OFFLINE,
} from "../../../../Util/Websocket.js";
import { ChatContext } from "../../Messenger";
import "./Css/ContactView.css";

export default function ContactView() {
  const [contacts, setContacts] = useState(null);

  const { selectedChat, setSelectedChat } = useContext(ChatContext);

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
    if (lastJsonMessage.action === ACTION_CONTACT_GET) {
      const incomingContacts = lastJsonMessage.content.contacts;

      if (incomingContacts.length === 0) {
        setContacts([]);
      } else {
        incomingContacts
          .sort((a, b) => {
            return a.unreadMessages - b.unreadMessages;
          })
          .reverse();

        setContacts(incomingContacts);
      }
    }

    switch (lastJsonMessage.notification) {
      case NOTIFICATION_MESSAGE_INCOMING: {
        const inChatID = lastJsonMessage.content.chatID;
        if (inChatID === selectedChat.chatId) return;
        setContacts((prev) =>
          prev.map((contact) =>
            contact.chatID === inChatID
              ? {
                  ...contact,
                  unreadMessages: contact.unreadMessages + 1,
                }
              : contact
          )
        );
        break;
      }
      case NOTIFICATION_USER_ONLINE: {
        const newUser = lastJsonMessage.content.from;
        setContacts((prev) => [
          ...prev?.filter((contact) => contact.uuid !== newUser.uuid),
          newUser,
        ]);
        break;
      }
      case NOTIFICATION_USER_OFFLINE: {
        const newUser = lastJsonMessage.content.from;
        setContacts((prev) => [
          ...prev?.filter((contact) => contact.uuid !== newUser.uuid),
          newUser,
        ]);
        break;
      }
      case NOTIFICATION_USER_UPDATE_PROFILE: {
        const newUser = lastJsonMessage.content.from;
        setContacts((prev) => [
          ...prev?.filter((contact) => contact.uuid !== newUser.uuid),
          newUser,
        ]);
        break;
      }
    }
  }, [lastJsonMessage]);

  const onContactClick = (uuid) => {
    const chatId =
      contacts.find((contact) => contact.uuid === uuid).chatID || "";
    sendJsonMessage({
      action: ACTION_GET_MESSAGE_LATEST,
      chatID: chatId,
    });

    sendJsonMessage({
      action: ACTION_PROFILE_GET_OTHER,
      target: uuid,
    });

    setContacts((prev) => {
      prev.forEach((contact) => {
        if (contact.uuid === uuid) {
          contact.unreadMessages = 0;
        }
      });
      return prev;
    });

    setSelectedChat((prev) => ({ ...prev, chatId: chatId, targetId: uuid }));

    localStorage.setItem("lastChat", chatId);
    localStorage.setItem("lastUser", uuid);
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
              lastMessage={contact.lastUnread?.content}
              status={contact.status.toLowerCase().replace(/_/g, " ")}
              onClick={onContactClick}
            />
          ))
        )}
      </div>
    </div>
  );
}

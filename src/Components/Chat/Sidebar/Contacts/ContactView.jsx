import React, { useEffect, useState } from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import Contact from "./Contact.jsx";
import {
  WEBSOCKET_URL,
  ACTION_CONTACT_GET,
} from "../../../../Util/Websocket.js";
import "./Css/ContactView.css";

export default function ContactView() {
  const [contacts, setContacts] = useState(null);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
    share: true,
  });

  useEffect(() => {
    sendJsonMessage({
      action: ACTION_CONTACT_GET,
    });

    return () => {
      console.log(
        "unmounting should save contacts to prevent to many requests"
      );
    };
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

  const onContactClick = (contact) => {
    console.log(contact);
  };

  return (
    <div className="contact-view view">
      <h2 className="title">Contacts</h2>
      <div className="scrollable">
        {contacts === null ? (
          <span className="placeholder">Loading data...</span>
        ) : (
          contacts.map((contact, i) => (
            <Contact
              key={i}
              name={contact.name}
              lastOnline={contact.lastOnline}
              profilPicture={contact.profilPicture}
              numberOfUnreadMessages={contact.numberOfUnreadMessages}
              isBlocked={contact.isBlocked}
              onClick={onContactClick}
            />
          ))
        )}
      </div>
    </div>
  );
}

function generateDummyContact(n) {
  let contacts = [];

  for (let i = 0; i < n; i++) {
    const contact = {
      name: "Elon Musk",
      lastOnline: "10days",
      numberOfUnreadMessages: parseInt(Math.random() * 1000 - 5),
      profilPicture: "src/image/default.png",
      isBlocked: Math.random() > 0.5,
    };
    contacts.push(contact);
  }

  return contacts;
}

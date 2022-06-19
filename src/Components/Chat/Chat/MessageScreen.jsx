import React, { useEffect, useState, useRef, useContext } from "react";
import { IoArrowDown } from "react-icons/io5";
import Message from "./Message";
import DayDivider from "./DayDivider";
import "./Css/MessageScreen.css";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { ChatContext } from "../Messenger";
import {
  WEBSOCKET_URL,
  ACTION_GET_MESSAGE_LATEST,
  ACTION_MESSAGE_SEND,
  NOTIFICATION_MESSAGE_INCOMING,
  NOTIFICATION_MESSAGE_READ,
  NOTIFICATION_MESSAGE_RECEIVED,
  ACTION_MESSAGE_READ,
  NOTIFICATION_USER_STARTED_TYPING,
  NOTIFICATION_USER_STOPPED_TYPING,
} from "../../../Util/Websocket";

export default function MessageScreen() {
  const [messages, setMessages] = useState([]);
  const [you, setYou] = useState(localStorage.getItem("userName"));

  const [showScrollDown, setShowScrollDown] = useState(false);

  const messageRefs = useRef([]);
  const messageScreenRef = useRef();
  const bottomRef = useRef();
  const typingRef = useRef();

  const { selectedChat } = useContext(ChatContext);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
    share: true,
  });

  useEffect(() => {
    bottomRef.current.scrollIntoView();
  });

  useEffect(() => {
    if (lastJsonMessage === null) return;

    switch (lastJsonMessage.action) {
      case ACTION_GET_MESSAGE_LATEST: {
        setMessages(lastJsonMessage.content.messages.reverse());
        break;
      }
      case ACTION_MESSAGE_SEND: {
        setMessages((prev) => [...prev, lastJsonMessage.content]);
        bottomRef.current.scrollIntoView();
        break;
      }
    }

    switch (lastJsonMessage.notification) {
      case NOTIFICATION_MESSAGE_INCOMING: {
        console.log("incoming message");

        if (selectedChat.chatId === lastJsonMessage.content.message.chat) {
          setMessages((prev) => [
            ...prev,
            {
              ...lastJsonMessage.content.message,
              author: lastJsonMessage.content.from,
            },
          ]);

          sendJsonMessage({
            action: ACTION_MESSAGE_READ,
            chatID: selectedChat.chatId,
            target: selectedChat.targetId,
          });
        } else {
          console.log("not in this chat, show a toast");
        }
        break;
      }
      case NOTIFICATION_MESSAGE_READ: {
        if (selectedChat.chatId !== lastJsonMessage.content.chat) return;
        setMessages((prev) => {
          const newMessages = prev.map((message) => ({
            ...message,
            status: "READ",
          }));
          return [...newMessages];
        });
        break;
      }
      case NOTIFICATION_MESSAGE_RECEIVED: {
        if (selectedChat.chatId !== lastJsonMessage.content.chat) return;
        setMessages((prev) => {
          const newMessages = prev.map((message) => ({
            ...message,
            status: "RECEIVED",
          }));
          return [...newMessages];
        });
        break;
      }
      case NOTIFICATION_USER_STARTED_TYPING: {
        if (selectedChat.chatId !== lastJsonMessage.content.chat) return;
        typingRef.current.innerText = `${lastJsonMessage.content.from.userName} is typing...`;
        break;
      }
      case NOTIFICATION_USER_STOPPED_TYPING: {
        if (selectedChat.chatId !== lastJsonMessage.content.chat) return;
        typingRef.current.innerText = "";
        break;
      }
    }
  }, [lastJsonMessage]);

  const jumpToMessage = (i) => {
    messageRefs.current[i].scrollIntoView({ behavior: "smooth" });
    messageRefs.current[i].classList.add("highlighted");
    messageRefs.current[i].addEventListener("animationend", () =>
      messageRefs.current[i].classList.remove("highlighted")
    );
  };

  const reactToMessage = (uuid) => {
    sendJsonMessage({
      action: ACTION_MESSAGE_REACT,
      messageID: uuid,
    });
  };

  const scrollDown = () => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="message-screen" ref={messageScreenRef}>
      <div className="scroll-down" onClick={scrollDown}>
        {showScrollDown && (
          <IoArrowDown
            style={{
              stroke: "url(#base-gradient)",
              fill: "url(#base-gradient)",
            }}
          />
        )}
      </div>
      {messages.map((message, i) => (
        <>
          {i === 0 ? (
            <DayDivider date={message.sent} key={i + 100000} />
          ) : (
            !sameDay(
              new Date(message.sent),
              new Date(messages[i - 1].sent)
            ) && <DayDivider date={message.sent} />
          )}
          <Message
            ref={(el) => (messageRefs.current[i] = el)}
            key={i}
            uuid={message.messageID}
            index={i}
            you={message.author === you ? true : false}
            author={message.author}
            time={message.sent}
            read={message.status}
            reactions={message.reactions}
            moreOptions
          >
            <>
              {message.relatedTo && (
                <div className="answer">
                  <Message
                    uuid={message.relatedTo.uuid}
                    you={message.relatedTo.relatedAuthor === you ? true : false}
                    author={message.relatedTo.relatedAuthor}
                    time={message.relatedTo.sent}
                    read={message.relatedTo.status}
                    reactions={message.relatedTo.reactions}
                    index={message.relatedTo.index}
                    onClick={jumpToMessage}
                  >
                    <>
                      {message.relatedTo.attachedMedia.length !== 0 &&
                        message.relatedTo.attachedMedia.map((media) => (
                          <img
                            src={`http://localhost:8808/assets${media.filePath}`}
                            alt={media.id}
                            className="image-media"
                          />
                        ))}
                      <div>{message.relatedTo.content}</div>
                    </>
                  </Message>
                </div>
              )}

              {message.attachedMedia?.length !== 0 &&
                message.attachedMedia.map((media) => (
                  <img
                    src={`http://localhost:8808/assets${media.filePath}`}
                    alt={media.id}
                    className="image-media"
                  />
                ))}
              <div>{message.content}</div>
            </>
          </Message>
        </>
      ))}

      <div className="typing" ref={typingRef}></div>
      <div className="bottom-ref" ref={bottomRef}></div>
    </div>
  );
}

function sameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function fillwithDummyMessages(n) {
  const dummy = [];

  var sentences = [
    "Hey",
    "orem ipsum dolor sit amet consectetur adipisicing elit. Maiores soluta hic consectetur pariatur recusandae, alias quibusdam iusto dicta, perferendis laudantium delectus deserunt obcaecati excepturi odio doloribus quos. Accusamus, minus. Iste sapiente odio beatae aliquam, voluptate optio blanditiis repellat reiciendis corrupti dignissimos, at iure consectetur laboriosam quis ut autem officia aperiam, libero similique. Modi atque dolor vel deserunt doloremque minus sint, neque quis porro totam dolorem! Magni voluptatem accusantium rerum quam laborum commodi natus cum magnam libero et nemo quasi officia, doloremque cumque culpa atque saepe sequi corrupti non, recusandae id labore, dignissimos voluptate? Ipsum eligendi minus, nesciunt modi nobis dolore.",
    "so fat not even Dora can explore her",
    "so  fat I swerved to miss her and ran out of gas",
    "so fat she won “The Bachelor” because she all those other bitches",
    "is like Bazooka Joe, 5 cents a blow",
    "is like an ATM, open 24/7",
    "is like a championship ring, everybody puts a finger in her",
  ];

  for (let i = 0; i < n; i++) {
    let message = {
      author: Math.random() > 0.5 ? "Someone" : "Mike",
      sent: Date.now() + (i + 1) * 10000000,
      content: sentences[Math.floor(Math.random() * sentences.length)],
      attachedMedia: [],
      related: false,
    };

    if (message.author === "You") {
      if (Math.random() > 0.5) {
        message.read = true;
      }
    }

    if (i == 8) message.related = true;

    dummy.push(message);
  }

  return dummy;
}

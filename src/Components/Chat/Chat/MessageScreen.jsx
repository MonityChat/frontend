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
  ACTION_MESSAGE_READ,
} from "../../../Util/Websocket";

export default function MessageScreen() {
  const [messages, setMessages] = useState([]);
  const [you, setYou] = useState(localStorage.getItem("userName"));
  const [showScrollDown, setShowScrollDown] = useState(false);

  const messageRefs = useRef([]);
  const messageScreenRef = useRef();
  const bottomRef = useRef();

  const selectedChat = useContext(ChatContext);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
    share: true,
  });

  useEffect(() => {
    // setMessages(fillwithDummyMessages(10));
    bottomRef.current.scrollIntoView();
  }, []);

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
        setMessages((prev) => {
          const newMessages = prev.map((message) => ({
            ...message,
            status: "READ",
          }));
          return [...newMessages];
        });
      }
    }
  }, [lastJsonMessage]);

  const jumpToMessage = (uuid) => {
    messageRefs.current[uuid].scrollIntoView();
    messageRefs.current[uuid].classList.add("highlighted");
    messageRefs.current[uuid].addEventListener("animationend", () =>
      messageRefs.current[uuid].classList.remove("highlighted")
    );
  };

  const scrollDown = () => {
    bottomRef.current.scrollIntoView();
  };

  return (
    <div
      className="message-screen"
      ref={messageScreenRef}
      onLoad={() => {
        messageScreenRef.current.scrollTop =
          messageScreenRef.current.scrollHeight;
        messageScreenRef.current.style.scrollBehavior = "smooth";
      }}
    >
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
        <Message
          ref={(el) => (messageRefs.current[i] = el)}
          key={i}
          uuid={message.messageID}
          you={message.author === you ? true : false}
          author={message.author}
          time={message.sent}
          read={message.status}
          reactions={message.reactions}
          moreOptions
        >
          <>
            {message.related && <div>is related</div>}
            {message.attachedMedia.length !== 0 && (
              <img src="/src/image/Donut.png" alt="" className="image-media" />
            )}
            <div>{message.content}</div>
          </>
        </Message>
      ))}
      {/* <DayDivider date={Date.now()} /> */}
      {/* <Message
        uuid={"913248124"}
        you={true}
        author={"Simon"}
        time={Date.now()}
        read={false}
        moreOptions
      >
        <>
          <div className="answer">
            <Message
              uuid={3}
              you={messages[3].author === you ? true : false}
              author={messages[3].author}
              time={messages[3].time}
              read={messages[3].read || false}
              onClick={jumpToMessage}
            >
              <>
                <img
                  className="image-media"
                  src="/src/image/Donut.png"
                  alt=""
                />
                <div>{messages[3].content}</div>
              </>
            </Message>
          </div>
          <div>I like it to my bro</div>
        </>
      </Message> */}
      <div className="bottom-ref" ref={bottomRef}></div>
    </div>
  );
}

function fillwithDummyMessages(n) {
  const dummy = [];

  var sentences = [
    "orem ipsum dolor sit amet consectetur adipisicing elit. Maiores soluta hic consectetur pariatur recusandae, alias quibusdam iusto dicta, perferendis laudantium delectus deserunt obcaecati excepturi odio doloribus quos. Accusamus, minus. Iste sapiente odio beatae aliquam, voluptate optio blanditiis repellat reiciendis corrupti dignissimos, at iure consectetur laboriosam quis ut autem officia aperiam, libero similique. Modi atque dolor vel deserunt doloremque minus sint, neque quis porro totam dolorem! Magni voluptatem accusantium rerum quam laborum commodi natus cum magnam libero et nemo quasi officia, doloremque cumque culpa atque saepe sequi corrupti non, recusandae id labore, dignissimos voluptate? Ipsum eligendi minus, nesciunt modi nobis dolore.",
    "so fat not even Dora can explore her",
    "so  fat I swerved to miss her and ran out of gas",
    "so smelly she put on Right Guard and it went left",
    "so fat she hasn’t got cellulite, she’s got celluheavy",
    "so fat she don’t need no internet – she’s already world wide",
    "so hair her armpits look like Don King in a headlock",
    "so classless she could be a Marxist utopia",
    "so fat she can hear bacon cooking in Canada",
    "so fat she won “The Bachelor” because she all those other bitches",
    "so stupid she believes everything that Brian Williams says",
    "so ugly she scared off Flavor Flav",
    "is like Domino’s Pizza, one call does it all",
    "is twice the man you are",
    "is like Bazooka Joe, 5 cents a blow",
    "is like an ATM, open 24/7",
    "is like a championship ring, everybody puts a finger in her",
  ];

  for (let i = 0; i < n; i++) {
    let message = {
      author: Math.random() > 0.5 ? "Someone" : "You",
      time: Date.now(),
      content: sentences[Math.floor(Math.random() * sentences.length)],
    };

    if (message.author === "You") {
      if (Math.random() > 0.5) {
        message.read = true;
      }
    }

    dummy.push(message);
  }

  return dummy;
}

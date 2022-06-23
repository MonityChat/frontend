import React, { useState, useRef, useEffect } from "react";
import { IoCheckmarkDone } from "react-icons/io5";
import { IoMdHourglass, IoMdMore } from "react-icons/io";
import { BsReply } from "react-icons/bs";
import { MdOutlineAddReaction } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import { AiOutlineDelete, AiOutlineEye, AiOutlineEdit } from "react-icons/ai";
import "./Css/Message.css";

/**
 * Component to display a message in the chat.
 * The details of the message will be given through props.
 * Depending on those, it will render the message correctly.
 * #It gets functions to call on certain events like editing a message.
 * The rendering on different sides is made with sometimes complex CSS
 * selectors and conditionally adding classes.
 */
export default React.forwardRef(function Message(
  {
    uuid,
    you,
    author,
    time,
    read,
    children,
    moreOptions,
    reactions,
    onClicks,
    index,
    message,
    edited,
  },
  ref
) {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [editing, setEditing] = useState(false);

  const textRef = useRef();
  const editRef = useRef();

  useEffect(() => {
    if (editing) {
    } else {
    }
  }, [editing]);

  const saveEdit = () => {
    const newText = editRef.current.value;
    setEditing(false);
    onClicks.onEdit && onClicks.onEdit(uuid, newText);
  };

  return (
    <div
      className={"message " + (you ? "right" : "left")}
      onClick={() => onClicks.onMessage && onClicks.onMessage(index)}
      onMouseLeave={(e) => setShowMoreOptions(false)}
      ref={ref}
    >
      <div className="information">
        {edited && <AiOutlineEdit />}
        <div className="read">
          {read === "READ" ? (
            <>
              <IoCheckmarkDone />
              <AiOutlineEye />
            </>
          ) : read === "RECEIVED" ? (
            <IoCheckmarkDone />
          ) : (
            <IoMdHourglass size={".75em"} />
          )}
        </div>
        <h1 className="author">{author}</h1>
        <div className="dot"></div>
        <span className="time">{formatTime(time)}</span>
      </div>

      <div className="content">
        {children}
        {editing ? (
          <div className="editing">
            <textarea ref={editRef}>{message}</textarea>
            <div className="save" onClick={saveEdit}>
              <div>Save</div>
              <FaRegSave
                size={"2rem"}
                style={{
                  fill: "url(#base-gradient)",
                }}
              />
            </div>
          </div>
        ) : (
          <div ref={textRef}>{message}</div>
        )}
        <div className="reaction-container">
          {reactions?.map((reaction) => (
            <div className="reaction">
              {String.fromCodePoint("0x" + reaction.reaction)}
              {reaction.count > 1 && (
                <span className="count">{reaction.count}</span>
              )}
            </div>
          ))}
        </div>
        {moreOptions && !showMoreOptions ? (
          <IoMdMore
            className="more"
            size={"2rem"}
            onClick={() => setShowMoreOptions(true)}
          />
        ) : (
          ""
        )}
        {showMoreOptions ? (
          <div
            className="more-options-menu"
            onClick={() => setShowMoreOptions(false)}
          >
            <BsReply
              size={"2rem"}
              onClick={() => onClicks.onRelate && onClicks.onRelate(uuid)}
            />
            <MdOutlineAddReaction
              size={"2rem"}
              onClick={() => onClicks.onReact && onClicks.onReact(uuid)}
            />
            {you && (
              <>
                <AiOutlineDelete
                  size={"2rem"}
                  onClick={() => onClicks.onDelete && onClicks.onDelete(uuid)}
                />
                <AiOutlineEdit
                  size={"2rem"}
                  onClick={() => setEditing((prev) => !prev)}
                />
              </>
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
});

/**
 * formating time so it will only display hour and minute
 */
function formatTime(time) {
  const formatted = new Date(time).toLocaleTimeString();
  return formatted.slice(0, -3);
}

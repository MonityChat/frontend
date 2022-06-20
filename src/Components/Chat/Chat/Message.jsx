import React, { useState, useContext } from "react";
import { IoCheckmarkDone, IoBookmarkOutline } from "react-icons/io5";
import { IoMdHourglass, IoMdMore } from "react-icons/io";
import { BsReply } from "react-icons/bs";
import { MdOutlineAddReaction } from "react-icons/md";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { RelatedContext } from "./Chat";
import "./Css/Message.css";

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
  },
  ref
) {
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const { setRelated } = useContext(RelatedContext);

  const handleAnswerClick = () => {
    setRelated(uuid);
  };

  const handleBookmarkClick = () => {};

  return (
    <div
      className={"message " + (you ? "right" : "left")}
      onClick={() => onClicks.onMessage && onClicks.onMessage(index)}
      onMouseLeave={(e) => setShowMoreOptions(false)}
      ref={ref}
    >
      <div className="information">
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
            <BsReply size={"2rem"} onClick={handleAnswerClick} />
            <MdOutlineAddReaction
              size={"2rem"}
              onClick={() => onClicks.onReact && onClicks.onReact(uuid)}
            />
            {/* <IoBookmarkOutline size={"2rem"} onClick={handleBookmarkClick} /> */}
            {you && (
              <AiOutlineDelete
                size={"2rem"}
                onClick={() => onClicks.onDelete && onClicks.onDelete(uuid)}
              />
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
});

function formatTime(time) {
  const formatted = new Date(time).toLocaleTimeString();
  return formatted.slice(0, -3);
}

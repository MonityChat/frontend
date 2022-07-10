import React from "react";
import { FaBolt } from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { MdMonitor } from "react-icons/md";
import { RiOpenSourceLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import BaseGradient from './../General/BaseGradient';
import "./Css/Home.css";


/**
 * Component for the home page. Displays some data about the project.
 */
export default function Home() {

  return (
    <div className="home-container">
      <BaseGradient />
      <div className="monity-grid">
        <h1>Monity</h1>
        <div className="line"></div>
      </div>
      <Link to="/login" className=" login-now">
        <IoMdLogIn
          size={"5rem"}
          style={{
            fill: "url(#base-gradient)",
          }}
        />
        <div>CHAT NOW</div>
      </Link>
      <div className="fast">
        <FaBolt
          size={"4rem"}
          style={{
            fill: "url(#base-gradient)",
          }}
        />
        <div>F</div>
        <div>A</div>
        <div>S</div>
        <div>T</div>
      </div>
      <a
        href="https://github.com/MonityChat"
        target="_blank"
        className="opensource"
      >
        <div>open source</div>
        <RiOpenSourceLine
          size={"8rem"}
          style={{
            fill: "url(#base-gradient)",
          }}
        />
      </a>
      <div className="messenger-for-all">
        <IoChatbubbleEllipsesOutline
          size={"5rem"}
          style={{
            fill: "url(#base-gradient)",
            stroke: "url(#base-gradient)",
          }}
        />
        <div>CHAT WITH ANYONE</div>
      </div>
      <div className="ui">
        <MdMonitor
          size={"2rem"}
          style={{
            fill: "url(#base-gradient)",
          }}
        />
        <div>simple and clean ui</div>
      </div>
      <div className="logo-image"> </div>
    </div>
  );
}

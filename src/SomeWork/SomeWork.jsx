import React from "react";
import "./SomeWork.css";
import { Link } from "react-router-dom";
import data from "../data.js";
import { SiGithub } from "react-icons/si";
import { VscLiveShare } from "react-icons/vsc";

// eslint-disable-next-line array-callback-return
data.map((work) => {
  console.log(work);
});

const SomeWork = () => {
  return (
    <section className="container">
      <div className="someWork">
        <h3>Some of my Works</h3>
        <div className="allWork">
          <span></span>
          <Link to="/work">All Works</Link>
        </div>
      </div>
      <div className="project">
        <div className="workImage">
          <img src="https://imgur.com/X3h3ei5.png" alt="" />
        </div>
        <div className="workContent">
          <span>01</span>
          <h2>Red Onion Foods</h2>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deserunt
            incidunt cupiditate praesentium dolores consectetur consequuntur
            animi voluptatum aspernatur deleniti alias!
          </p>
          <div className="skills__set">
            <p>JavaScript</p>
            <p>JavaScript</p>
            <p>JavaScript</p>
            <p>JavaScript</p>
            <p>JavaScript</p>
            <p>JavaScript</p>
            <p>JavaScript</p>
            <p>JavaScript</p>
            <p>JavaScript</p>
          </div>

          <div className="btn">
            <span>
              <VscLiveShare />
              <span> Live</span>
            </span>
            <span className="git">
              <SiGithub />
              <span>Code</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SomeWork;

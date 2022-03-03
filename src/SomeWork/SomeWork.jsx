import React from "react";
import "./SomeWork.css";
import { Link } from "react-router-dom";

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
          <p>Content122</p>
        </div>
      </div>
    </section>
  );
};

export default SomeWork;

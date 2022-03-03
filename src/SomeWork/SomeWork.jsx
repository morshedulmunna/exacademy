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
    </section>
  );
};

export default SomeWork;

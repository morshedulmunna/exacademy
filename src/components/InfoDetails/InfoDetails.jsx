import React from "react";
import "./InfoDetailsStyle.css";
import H_Image from "../../../src/images/infosecimg.png";
const InfoDetails = () => {
  return (
    <>
      <section className=" container wrapper">
        <div className="text__area">
          <span>Hello , I'm</span>
          <h1>Morshedul Munna</h1>
          <ul>
            <li>Web Developer</li>
            <li>Programmer</li>
          </ul>
          <p>
            A self-motivated and enthusiastic web developer with a deep interest
            in JavaScript. To work in the Software industry with modern web
            technologies of different local & multinational Software/ IT
            agencies of Bangladesh and grow rapidly with increasing
            responsibilities.
          </p>
          <a href="/about" id="about">
            About Me
          </a>
          <a id="touch" href="/contact">
            Get in touch
          </a>
        </div>
        <img src={H_Image} alt="Header" />
      </section>
    </>
  );
};

export default InfoDetails;

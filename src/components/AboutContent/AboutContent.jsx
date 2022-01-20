import React from "react";
import "./AboutContent.css";
import H_Image from "../../../src/images/infosecimg.png";

const AboutContent = () => {
  return (
    <>
      <div className="container about__content">
        <div className="programmer__info">
          <img src={H_Image} alt="" />
          <div className="programmertext__area">
            <h2>
              <span>I'm</span> Morshedul Munna
            </h2>
            <p>
              A self-motivated and enthusiastic web developer with a deep
              interest in JavaScript. To work in the Software industry with
              modern web technologies of different local & multinational
              Software/ IT agencies of Bangladesh and grow rapidly with
              increasing responsibilities.
            </p>
          </div>
        </div>
        <div className="skills__set">
          <div className="set1">
            <h3>My Skills Set</h3>
            <p>JavaScript</p>
            <p>ES6</p>
            <p>React.js</p>
            <p>Node.js</p>
            <p>Express.js</p>
            <p>MongoDB</p>
            <p>Redux.js</p>
            <p>Gatsby.js</p>
            <p>Tailwind CSS</p>
            <p>HTML5</p>
            <p>CSS3</p>
            <p>PHP</p>
            <p>MySQL</p>
            <p>Git</p>
            <p>Webpack</p>
            <p>NPM</p>
            <p>Babel</p>
            <p>VS Code</p>
            <p>REST API</p>
            <p>Firebase</p>
            <p>C</p>
            <p>C++</p>
          </div>
          <div className="set2">
            <h3>I want to work with</h3>
            <p>JavaScript</p>
            <p>React.js</p>
            <p>Gatsby.js</p>
            <p>REST API</p>
            <p>Redux.js</p>
            <p>Tailwind CSS</p>
          </div>
          <div className="set3">
            <h3>I prefer not to work with</h3>
            <p>PHP</p>
            <p>Laravel</p>
            <p>JQuery</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutContent;

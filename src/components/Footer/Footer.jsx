import React from "react";
import "./Footer.css";
import { AiFillStar } from "react-icons/ai";
import { BiGitRepoForked } from "react-icons/bi";

const Footer = () => {
  return (
    <>
      <div className="footer">
        <p>
          Designed & Built by
          <a href="https://github.com/morshedulmunna"> morshedul munna </a>
        </p>
        <div className="star__forks">
          <i>
            <AiFillStar />
          </i>
          <p>Start & </p>
          <i>
            <BiGitRepoForked />
          </i>
          <p>Forks</p>
          <a id="byMe" href="https://github.com/morshedulmunna">
            By Me
          </a>
        </div>
      </div>
    </>
  );
};

export default Footer;

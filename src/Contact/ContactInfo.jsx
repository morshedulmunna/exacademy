import React from "react";
import "./ContactInfo.css";
import "../responsive.css";

const ContactInfo = () => {
  return (
    <>
      <div className="form__wrapper">
        <div className="form">
          <h1>Get In Touch</h1>
          <input type="Name" placeholder="Your Name" />
          <input type="Email" placeholder="Your Email" />
          <textarea
            name="message"
            rows="12"
            placeholder="Your Message"
            id="formBasicPassword"
            class="form-control"
          ></textarea>
          <button type="submit">Submit</button>
          <p class="font-italic">
            send to email :
            <a href="mailto:morshedulmunna1@gmail.com">
              morshedulmunna1@gmail.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default ContactInfo;

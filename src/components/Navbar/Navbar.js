import React, { useState } from "react";
import { FaBars, FaFacebook, FaTimes, FaYoutube } from "react-icons/fa";
import { GoMarkGithub } from "react-icons/go";
import { TiSocialTwitter, TiSocialLinkedin } from "react-icons/ti";
import { IconContext } from "react-icons/lib";

import {
  Nav,
  NavLogo,
  NavIcon,
  MobileIcon,
  NavMenu,
  NavItem,
  Button,
  SideLine,
  Sidebar,
  SocialIcon,
  SideIcon,
} from "./Navbar.elements";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <Nav>
          <NavLogo to="/">
            <NavIcon />
            MUNNA
          </NavLogo>
          <MobileIcon onClick={handleClick}>
            {click ? <FaTimes /> : <FaBars />}
          </MobileIcon>
          <NavMenu onClick={handleClick} click={click}>
            <NavItem>
              <NavLink to="/home" activeClassName="nav-active">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/about" activeClassName="nav-active">
                About
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/works" activeClassName="nav-active">
                Works
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/blog" activeClassName="nav-active">
                Blog
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/contact" activeClassName="nav-active">
                Contact
              </NavLink>
            </NavItem>
            <a target="/blank" href="https://github.com/morshedulmunna">
              <Button>Resume</Button>
            </a>
          </NavMenu>
        </Nav>
      </IconContext.Provider>

      <Sidebar>
        <SocialIcon>
          <SideIcon>
            <a target="/blank" href="https://github.com/morshedulmunna">
              <GoMarkGithub />
            </a>
          </SideIcon>
          <SideIcon>
            <a target="/blank" href="https://twitter.com/morshedulmunna">
              <TiSocialTwitter />
            </a>
          </SideIcon>
          <SideIcon>
            <a
              target="/blank"
              href="https://www.linkedin.com/in/morshedulmunna/"
            >
              <TiSocialLinkedin />
            </a>
          </SideIcon>
          <SideIcon>
            <a
              target="/blank"
              href="https://www.youtube.com/channel/UCRuGYF7DvCpbtinkNKNSe3A"
            >
              <FaYoutube />
            </a>
          </SideIcon>
          <SideIcon>
            <a
              target="/blank"
              href="https://www.facebook.com/morshedulmunna.id/"
            >
              <FaFacebook />
            </a>
          </SideIcon>
        </SocialIcon>
        <SideLine></SideLine>
      </Sidebar>
    </>
  );
};
export default Navbar;

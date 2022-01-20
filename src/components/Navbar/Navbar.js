import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { IconContext } from "react-icons/lib";

import {
  Nav,
  NavLogo,
  NavIcon,
  MobileIcon,
  NavMenu,
  NavItem,
  Button,
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
              <NavLink to="/" activeClassName="nav-active">
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
    </>
  );
};
export default Navbar;

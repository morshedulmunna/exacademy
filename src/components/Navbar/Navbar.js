import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { IconContext } from "react-icons/lib";

import {
  Nav,
  NavContainer,
  NavLogo,
  NavIcon,
  MobileIcon,
  NavMenu,
  NavLinks,
  NavItem,
  Button,
} from "./Navbar.elements";

const Navbar = () => {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <Nav>
          <NavContainer>
            <NavLogo to="/">
              <NavIcon />
              MUNNA
            </NavLogo>
            <MobileIcon onClick={handleClick}>
              {click ? <FaTimes /> : <FaBars />}
            </MobileIcon>
            <NavMenu onClick={handleClick} click={click}>
              <NavItem>
                <NavLinks to="/">Home</NavLinks>
              </NavItem>
              <NavItem>
                <NavLinks to="/">About</NavLinks>
              </NavItem>
              <NavItem>
                <NavLinks to="/">Works</NavLinks>
              </NavItem>
              <NavItem>
                <NavLinks to="/">Blog</NavLinks>
              </NavItem>
              <NavItem>
                <NavLinks to="/">Contact</NavLinks>
              </NavItem>
              <Button to="/">Resume</Button>
            </NavMenu>
          </NavContainer>
        </Nav>
      </IconContext.Provider>
    </>
  );
};

export default Navbar;

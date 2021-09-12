import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container } from "../../globalStyle";
import { FaMagento } from "react-icons/fa";

export const Nav = styled.nav`
  background: #0a192f;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 999;
`;

export const NavContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;

  ${Container}
`;

export const NavLogo = styled(Link)`
  color: #fff;
  justify-content: flex-start;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
`;

export const NavIcon = styled(FaMagento)`
  margin-right: 0.5rem;
`;

export const MobileIcon = styled.div`
  display: none;

  @media screen and (max-width: 960px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 50%);
    font-size: 1.8rem;
    cursor: pointer;
  } ;
`;

export const NavMenu = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  text-align: center;

  @media screen and (max-width: 960px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 60vh;
    position: absolute;
    top: 60px;
    left: ${({ click }) => (click ? 0 : "-100%")};
    opacity: 1;
    transition: all 0.5s ease;
    background: #0a192f;
  }
`;

export const NavItem = styled.li`
  height: 60px;

  @media screen and (max-width: 960px) {
    width: 100%;
    &::hover {
      border: none;
    }
  }
`;

export const NavLinks = styled(Link)`
  color: #fff;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1.5rem 0 1.5rem;
  height: 100%;

  &:hover {
    color: #0df2c9;
    transition: all 0.03s ease;
  }
  @media screen and (max-width: 960px) {
    text-align: center;
    padding: 2rem;
    width: 100%;
    display: table;

    &:hover {
      color: #0df2c9;
      transition: all 0.03s ease;
    }
  }
`;

export const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: transparent;
  border: 2px solid #28a645;
  color: #28a645;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #28a645;
    color: #fff;
  }
  @media screen and (max-width: 960px) {
    margin-top: 2rem;
    text-align: center;
    display: table;
  }
`;

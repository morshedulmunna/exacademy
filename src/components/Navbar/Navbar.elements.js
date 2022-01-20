import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaMagento } from "react-icons/fa";

export const Nav = styled.nav`
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background: #0a192f;
  padding: 0 5rem;
  @media screen and (max-width: 991px) {
    padding: 0 2rem;
  }
`;

export const NavLogo = styled(Link)`
  color: #fff;
  justify-content: flex-start;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  margin-left: 5rem;
  @media screen and (max-width: 960px) {
    margin-left: 0px;
  }
`;

export const NavIcon = styled(FaMagento)`
  margin-right: 0.5rem;
`;

export const MobileIcon = styled.div`
  display: none;

  @media screen and (max-width: 960px) {
    display: block;
    font-size: 1.8rem;
    cursor: pointer;
  } ;
`;

export const NavMenu = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  text-align: center;
  margin-right: 5rem;

  @media screen and (max-width: 960px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 60px;
    left: ${({ click }) => (click ? 0 : "-100%")};
    opacity: 1;
    transition: all 0.5s ease;
    background: #0a192f;
  }
`;

export const NavItem = styled.li`
  padding: 0 1.5rem 0 1.5rem;
  @media screen and (max-width: 960px) {
    padding: 2rem 0;
  }
  a {
    color: #fff;
    display: flex;
    align-items: center;
    text-decoration: none;
    height: 100%;

    &:hover {
      color: #0df2c9;
      transition: all 0.05s ease;
    }
    @media screen and (max-width: 960px) {
      text-align: center;
      width: 100%;
      display: table;

      &:hover {
        color: #0df2c9;
        transition: all 0.05s ease;
      }
    }
  }

  .nav-active {
    border-top: 1px solid #0df2c9;
    width: 100%;
    padding-top: 4px;
  }
`;

export const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: transparent;
  border: 2px solid #28a645;
  color: #28a645;
  outline: none;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #28a645;
    color: #fff;
    transition: all 0.9s;
  }
  @media screen and (max-width: 960px) {
    margin-top: 2rem;
    text-align: center;
    width: 100%;
  }
`;

export const Sidebar = styled.div`
  position: fixed;
  bottom: 0;
  left: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 960px) {
    left: 10px;
  }
`;

export const SideIcon = styled.div`
  margin: 10px 0 10px 0;
  &::hover {
    margin-bottom: 10px;
  }
  a {
    color: #fff;
  }
`;
export const SocialIcon = styled.div`
  margin: 20px 0 20px 0;
  color: #fff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
`;
export const SideLine = styled.div`
  width: 1px;
  height: 150px;
  background: #fff;
`;

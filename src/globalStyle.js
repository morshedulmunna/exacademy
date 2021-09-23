import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Roboto";
}
`;

export const BodyContiner = styled.div`
  background: #0a192f;
  padding-top: 60px;
`;

export const NavContainer = styled.div`
  width: 100%;
  @media screen and (max-width: 991px) {
    padding-right: 30px;
    padding-left: 30px;
  }
`;

export const Container = styled.div`
  max-width: 1320px;
  margin: auto;
  @media screen and (max-width: 1200px) {
    max-width: 1140px;
    margin: auto;
    margin-left: 50px;
  }
  @media screen and (max-width: 992px) {
    max-width: 960px;
    margin: auto;
  }
  @media screen and (max-width: 768px) {
    max-width: 100%;
    margin: auto;
  }
  @media screen and (max-width: 576px) {
    max-width: 100%;
    margin: auto;
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

export default GlobalStyle;

import React from "react";
import { Container } from "../../globalStyle";
import { HomeData } from "../data";
import {
  Header,
  HeaderBtn,
  HeaderContent,
  HeaderDiscription,
  HeaderH1,
  HeaderImage,
  HeaderLi,
  HeaderUl,
  SpanP,
} from "./Home.style";
import img from "../../images/infosecimg.png";
import { Link } from "react-router-dom";

const Home = () => {
  const { topLine, name, profession1, profession2, discription } = HomeData;
  return (
    <>
      <Container>
        <Header>
          <HeaderImage>
            <img src={img} alt="HeaderImage" />
          </HeaderImage>
          <HeaderContent>
            <SpanP> {topLine} </SpanP>
            <HeaderH1> {name} </HeaderH1>
            <HeaderUl>
              <HeaderLi> {profession1} </HeaderLi>
              <HeaderLi> {profession2} </HeaderLi>
            </HeaderUl>
            <HeaderDiscription>{discription}</HeaderDiscription>
            <HeaderBtn>
              <Link to="/about" className="aboutBtn">
                About
              </Link>
              <Link to="/get-in-touch"> Get in touch </Link>
            </HeaderBtn>
          </HeaderContent>
        </Header>
      </Container>
      {/* Header 2nd Part Few Workd */}
      {/* <Container>
        <h1>lorem300</h1>
      </Container> */}
    </>
  );
};

export default Home;

import React from "react";
import { Container } from "../../globalStyle";
import { HomeData } from "../data";
import {
  Header,
  HeaderContent,
  HeaderDiscription,
  HeaderH1,
  HeaderImage,
  HeaderLi,
  HeaderUl,
  SpanP,
} from "./Home.style";
import img from "../../images/infosecimg.png";

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
          </HeaderContent>
        </Header>
      </Container>
    </>
  );
};

export default Home;

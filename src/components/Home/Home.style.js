import styled from "styled-components";

export const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    margin-top: 40px;
  }
`;
export const HeaderContent = styled.div`
  width: 50%;
  order: 0;
  @media screen and (max-width: 768px) {
    order: 1;
    width: 80%;
  }
`;
export const HeaderImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  order: 1;
  @media screen and (max-width: 768px) {
    order: 0;
  }
  img {
    width: 70%;
    @media screen and (max-width: 576px) {
      width: 90%;
    }
  }
`;

// Header Text Area
export const SpanP = styled.p`
  color: #0df2c9;
  margin-bottom: 20px;
`;

export const HeaderH1 = styled.h1`
  color: #fff;
  letter-spacing: 3px;
  line-height: 48px;
  font-weight: 500;
  font-size: 40px;
  font-style: normal;
  @media screen and (max-width: 768px) {
    font-size: 29px;
  }
`;
export const HeaderUl = styled.ul`
  display: flex;
  justify-content: space-around;
  width: 50%;

  @media screen and (max-width: 1110px) {
    flex-direction: row;
    width: 50%;
  }
  @media screen and (max-width: 960px) {
    flex-direction: column;
    margin-left: 20px;
  }
`;
export const HeaderLi = styled.li`
  color: #0df2c9;
  line-height: 48px;
`;
export const HeaderDiscription = styled.p`
  color: #fff;
  line-height: 25px;
`;

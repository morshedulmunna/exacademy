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

export const HeaderBtn = styled.div`
  margin-top: 30px;
  display: flex;
  width: 50%;
  /* background: #fff; */
  justify-content: space-between;
  a {
    text-decoration: none;
    text-align: center;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background: transparent;
    border: 2px solid #28a645;
    color: #28a645;
    outline: none;
    cursor: pointer;
    font-size: 0.9rem;
    width: 120px;
    &:hover {
      background: #218838;
      color: #fff;
    }
    &.aboutBtn {
      background: #28a645;
      color: white;
      &.aboutBtn::hover {
        background: #218838;
      }
    }
  }
  @media screen and (max-width: 960px) {
    flex-direction: column;
    a {
      margin: 20px 20px 20px 0px;
      padding: 10px 10px;
      width: 120px;
      &:hover {
        background: #28a645;
        color: #fff;
      }
      &.aboutBtn {
        background: #28a645;
        color: white;
        &.aboutBtn::hover {
          background: #218838;
        }
      }
    }
  }
`;

/* Header 2nd Part Few Workd */

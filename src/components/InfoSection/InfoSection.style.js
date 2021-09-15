import styled from "styled-components";

export const InfoSec = styled.div`
  color: #fff;
  height: 50vh;
  width: 100%;
  /* Backgraund Changeing Optopn */
  background: ${({ lightBg }) => (lightBg ? "#0a192f" : "#fff")};
`;

export const InfoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  /* flex-direction: ${({ imgStart }) => (imgStart ? "row-reverse" : "row")}; */
`;

export const InfoDiv = styled.div`
  margin-bottom: 15px;
  padding: 0 15px 0 15px;
  flex: 1;
  max-width: 50%;
  flex-basis: 50%;

  @media screen and (max-width: 768px) {
    max-width: 100%;
    display: flex;
    justify-content: center;
    flex-basis: 100%;
  }
`;

export const TextWrapper = styled.div`
  max-width: 540px;
  padding-top: 20px;
  padding-bottom: 60px;

  @media screen and (max-width: 768px) {
    padding-bottom: 65px;
  }
`;

export const TopLine = styled.p`
  color: #3b978d;
`;

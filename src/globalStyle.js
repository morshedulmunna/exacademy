import styled, { createGlobalStyle } from "styled-components";

const CreateGlobalStyle = createGlobalStyle`
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Roboto";
  background: #0A192F;
}

`;
export const Container = styled.div`
  z-index: 1;
  width: 100%;
  padding: 0 100px 0 100px;

  @media screen and (max-width: 991px) {
    padding: 0 30px 0 30px;
  }
`;

export default CreateGlobalStyle;

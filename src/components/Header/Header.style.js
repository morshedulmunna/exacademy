import styled from "styled-components";
import { Container } from "../../globalStyle";

export const HeaderContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  margin-top: 2rem;
  left: 50%;
  transform: translate(-50%);
  ${Container}
`;

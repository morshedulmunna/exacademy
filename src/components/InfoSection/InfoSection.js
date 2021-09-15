import React from "react";
import { Container } from "../../globalStyle";
import {
  InfoDiv,
  InfoRow,
  InfoSec,
  TextWrapper,
  TopLine,
} from "./InfoSection.style";

export const InfoSection = (lightBg, imgStart, topline) => {
  return (
    <>
      <InfoSec lightBg={lightBg}>
        <Container>
          <InfoRow imgStart={imgStart}>
            <InfoDiv>
              <TextWrapper>
                <TopLine> {topline} </TopLine>
                {/* <Heading>Morshedul Munna</Heading>
                <SubTittle>
                  <TittleUl>
                    <TittleLi>Web Developer</TittleLi>
                    <TittleLi>Programmer</TittleLi>
                  </TittleUl>
                </SubTittle>
                <Discription>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Corporis et nostrum odio similique est perferendis, quidem
                  voluptate quae impedit quisquam?
                </Discription> */}
              </TextWrapper>
            </InfoDiv>
            <InfoDiv>
              <TextWrapper>thsiifs </TextWrapper>
            </InfoDiv>
          </InfoRow>
        </Container>
      </InfoSec>
    </>
  );
};

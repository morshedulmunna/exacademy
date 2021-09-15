import React from "react";
import { InfoSection } from "../../components/InfoSection/InfoSection";
import { homeObjOne } from "./Data";

const Home = () => {
  return (
    <>
      <InfoSection {...homeObjOne}></InfoSection>
    </>
  );
};

export default Home;

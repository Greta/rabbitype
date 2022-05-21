import React, { useEffect } from "react";
import styled from "styled-components";
import { EngineContext, EngineContextObject } from "../modules";

import logo from "../assets/logo.gif";

const StyledScreen = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > img {
    height: 100vmin;
  };
`;

const LogoScreen: React.FC = () => {
  const {changeScreen} = React.useContext(EngineContext) as EngineContextObject;

  useEffect(() => {
    setTimeout(() => {
      changeScreen("mainMenu");
    }, 2000);
  }, []);

  return (
    <StyledScreen>
      <img src={logo} alt="logo" />
    </StyledScreen>
  );
};

export default LogoScreen;

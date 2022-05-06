import React from "react";
import styled from "styled-components";

import logo from "../assets/logo.gif";

const StyledScreen = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  > img {
    height: 100vmin;
  };
`;

const LogoScreen: React.FC = () => {
  return (
    <StyledScreen>
      <img src={logo} alt="logo" />
    </StyledScreen>
  );
};

const S1: React.FC = () => {
  return (
    <StyledScreen>
      <h1>Screen 1</h1>
    </StyledScreen>
  );
};

const S2: React.FC = () => {
  return (
    <StyledScreen>
      <h1>Screen 2</h1>
    </StyledScreen>
  );
};

export { LogoScreen, S1, S2 };

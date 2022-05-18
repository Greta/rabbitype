import React, { useEffect } from "react";
import styled from "styled-components";
import EngineContext, { EngineContextObject } from "../modules/EngineContext";

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

const Buttons = styled.div`
  > div {
    display: inline;
    margin: 15px;
    background: pink;
    color: black;
    border-radius: 10px;
    padding: 5px 10px;
    cursor: pointer;
    &:hover {
      background: #bada55;
    }
  }
`;

interface TestButtonProps {
  text: string;
  onClick: () => void;
}

const TestButton: React.FC<TestButtonProps> = ({
  text,
  onClick
}) => {
  return (
    <div onClick={onClick}>{text}</div>
  );
};

const LogoScreen: React.FC = () => {
  const {changeScreen} = React.useContext(EngineContext) as EngineContextObject;

  useEffect(() => {
    setTimeout(() => {
      changeScreen("s1");
    }, 2000);
  }, []);

  return (
    <StyledScreen>
      <img src={logo} alt="logo" />
    </StyledScreen>
  );
};

const S1: React.FC = () => {
  const {changeScreen} = React.useContext(EngineContext) as EngineContextObject;

  return (
    <StyledScreen>
      <h1>Venusaur</h1>
      <Buttons>
        <TestButton onClick={() => changeScreen("s2")} text="Screen 2" />
      </Buttons>
    </StyledScreen>
  );
};

const S2: React.FC = () => {
  const {changeScreen} = React.useContext(EngineContext) as EngineContextObject;
  return (
    <StyledScreen>
      <h1>URSULA SUSAN PRISBY</h1>
      <Buttons>
        <TestButton onClick={() => changeScreen("s1")} text="Screen 1" />
      </Buttons>
    </StyledScreen>
  );
};

export { LogoScreen, S1, S2 };

import React, { useContext } from "react";
import styled from "styled-components";
import EngineContext, { EngineContextObject } from "../modules/EngineContext";

const Buttons = styled.div`
  & > div {
    text-align: center;
    margin: 15px;
    padding: 5px 10px;
    border: 3px solid white;
    &:hover {
      background: #1a1a1a;
    }
    &.on {
      border-color: #a31a5d;
      color: #a31a5d;
    }
  }
`;

const StyledScreen = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & h1, & h2 {
    margin: 15px;
  }
`;

interface OptionButtonProps {
  id: string;
  text: string;
}

const OptionButton: React.FC<OptionButtonProps> = ({id, text}) => {
  const {
    gameSettings: settings,
    updateGameSettings: updateSettings,
    changeScreen
  } = useContext(EngineContext) as EngineContextObject;

  const handleClick = (pool: string) => {
    updateSettings({...settings, pool });
    changeScreen("practice");
  };

  return (
    <div
      className={`${settings.pool === id ? "on" : ""}`}
      onClick={ () => handleClick(id) }
    >
      {text}
    </div>
  );
};

const MainMenu: React.FC = () => {
  return (
    <StyledScreen>
      <h1>Key to the Garden</h1>
      <h2>Simple Practice</h2>
      <Buttons>
        <OptionButton id="top" text="Top Row" />
        <OptionButton id="home" text="Home Row" />
        <OptionButton id="bottom" text="Bottom Row" />
        <OptionButton id="all" text="All Letters" />
      </Buttons>
    </StyledScreen>
  );
};

export default MainMenu;

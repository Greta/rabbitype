import React, { useContext, useState } from "react";
import styled from "styled-components";
import EngineContext, { EngineContextObject } from "../modules/EngineContext";

const highlight = "cyan";

const Buttons = styled.div`
  & > div {
    text-align: center;
    margin: 15px;
    padding: 10px 10px 5px;
    border: 3px solid white;
    &:hover {
      background: #1a1a1a;
    }
    &.on {
      border-color: ${highlight};
      color: ${highlight};
    }
  }
`;

const Flex = styled.div`
  padding: 100px;
  display: flex;
`;

const Menu = styled.div`
  flex: 0 0 450px;
  text-align: center;
  & h1 {
    font-size: 2.5em;
    margin: 15px;
  }
  > div {
    width: 300px;
    margin: 30px auto;
  }
`;

const SubMenu = styled.div`
  flex: 1;
  padding-left: 50px;
`;

const OptionGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 5vw;
  > div {
    &.on {
      color: ${highlight}
    }
  }
`;

const Go = styled.div`
  color: magenta;
  border: 3px solid magenta;
  float: right;
  padding: 10px 15px 6px;
  margin-top: 50px;
  &:hover {
    color: yellow;
  }
`;

interface OptionButtonProps {
  id: string;
  text: string;
}

const Option: React.FC<OptionButtonProps> = ({id, text}) => {
  const {
    practiceSettings: settings,
    updatePracticeSettings: updateSettings,
  } = useContext(EngineContext) as EngineContextObject;

  const handleClick = (pool: keyof typeof settings.pool) => {
    const newSettings = { ...settings };
    newSettings.pool[pool] = !newSettings.pool[pool];
    updateSettings(newSettings);
  };

  const typedId = id as keyof typeof settings.pool;
  return (
    <div
      className={`${settings.pool[typedId] ? "on" : ""}`}
      onClick={ () => handleClick(typedId) }
    >
      {text}
    </div>
  );
};

const MainMenu: React.FC = () => {
  const { changeScreen } = useContext(EngineContext) as EngineContextObject;
  const [menuChoice, setMenuChoice] = useState("");

  return (
    <Flex>
      <Menu>
        <h1>Rabbitype</h1>
        <Buttons>
          <div
            className={menuChoice === "story" ? "on" : ""}
            onClick={() => setMenuChoice("story")}>STORY</div>
          <div
            className={menuChoice === "practice" ? "on" : ""}
            onClick={() => setMenuChoice("practice")}>PRACTICE</div>
        </Buttons>
      </Menu>
      {menuChoice === "story" &&
        <SubMenu>
          <h2>[Story Track]</h2>
        </SubMenu>
      }
      {menuChoice === "practice" &&
        <SubMenu>
          <h2>Practice</h2>
          <h3>Key Pool</h3>
          <OptionGroup>
            <Option id="top" text="Top Row" />
            <Option id="home" text="Home Row" />
            <Option id="bottom" text="Bottom Row" />
            <Option id="numbers" text="Numbers" />
          </OptionGroup>
          <Go onClick={() => changeScreen("practice")}>Go!</Go>
        </SubMenu>
      }
    </Flex>
  );
};

export default MainMenu;

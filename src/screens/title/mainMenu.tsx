import React, { useContext } from "react";
import styled, { keyframes } from "styled-components";
import EngineContext, { EngineContextObject } from "../../modules/EngineContext";
import PracticeSettings from "./practiceSettings";

const color1 = "cyan";
const color2 = "magenta";

const MenuButtons = styled.div`
  div:not(.subMenu) {
    text-align: center;
    margin: 15px;
    padding: 10px 10px 5px;
    border: 3px solid white;
    &:hover {
      background: #1a1a1a;
    }
    &.on {
      border-color: ${color1};
      color: ${color1};
    }
  }
  .subMenu {
    margin-left: 15px;
    border-left: 5px solid ${color2};
    > div {
      text-align: left;
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

const MenuScreen = styled.div`
  flex: 1;
  padding-left: 50px;
`;

const StoryName = styled.div`
  font-size: 18px;
  padding: 20px;
`;

const blink = keyframes`
  50% {
    opacity: 0;
  }
`;

const Input = styled.div`
  position: relative;
  border: 3px solid white;
  padding: 15px 15px 10px;
  &::after {
    content: "";
    position: absolute;
    top: 10px;
    bottom: 15px;
    width: 5px;
    background: ${color2};
    margin-left: 3px;
    animation: ${blink} 1s step-start infinite;
  }
`;

const Go = styled.div`
  color: magenta;
  border: 3px solid ${color2};
  float: right;
  padding: 10px 15px 6px;
  margin-top: 50px;
  &:hover {
    color: yellow;
  }
`;

const MainMenu: React.FC = () => {
  const {
    menuSettings: menu,
    updateMenuSettings,
  } = useContext(EngineContext) as EngineContextObject;

  const isStoryMenuActive = () => ["story", "create", "load"].includes(menu.location);

  const handleMenuUpdate = (location: string) => {
    updateMenuSettings({ ...menu, location });
  };

  return (
    <Flex>
      <Menu>
        <h1 className="title">Rabbitype</h1>
        <MenuButtons>
          <div
            className={isStoryMenuActive() ? "on" : ""}
            onClick={() => handleMenuUpdate("story")}>STORY MODE</div>
          {isStoryMenuActive() &&
            <div className="subMenu">
              <div
                className={menu.location === "create" ? "on" : ""}
                onClick={() => handleMenuUpdate("create")}>New</div>
              <div
                className={menu.location === "load" ? "on" : ""}
                onClick={() => handleMenuUpdate("load")}>Load</div>
            </div>
          }
          <div
            className={menu.location === "practice" ? "on" : ""}
            onClick={() => handleMenuUpdate("practice")}>PRACTICE</div>
        </MenuButtons>
      </Menu>
      {menu.location === "create" &&
        <MenuScreen>
          <h2>In Progress...</h2>
          {/* <h2>Start a new story ...</h2>
          <div>
            <label>TYPE a name!</label>
            <Input>{menu.storyName}</Input>
          </div>
          <Go onClick={() => console.log(menu.storyName, "start game with this name")}>Go!</Go> */}
        </MenuScreen>
      }
      {menu.location === "load" &&
        <MenuScreen>
          <h2>In Progress...</h2>
          {/* <h2>Load Story</h2>
          {menu.storyNames.map((storyName: string) =>
            <StoryName key={storyName}>{storyName}</StoryName>
          )} */}
        </MenuScreen>
      }
      {menu.location === "practice" &&
        <MenuScreen>
          <PracticeSettings />
        </MenuScreen>
      }
    </Flex>
  );
};

export default MainMenu;

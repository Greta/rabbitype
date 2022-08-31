import React, { useContext } from "react";
import styled, { keyframes } from "styled-components";
import EngineContext, { EngineContextObject } from "../modules/EngineContext";

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

const OptionGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 5vw;
  &.min > div , &.max > div {
    color: black;
    position: relative;
    :before {
      content: "^";
      position: absolute;
      width: 100%;
      text-align: center;
    }
    &:not(.arrow):hover:before {
      opacity: .5;
    }
  }
  &.min > div {
    :before {
      transform: scale(1, -1);
      bottom: 5px;
    }
  }
  &.show > div {
    &.arrow, &:hover {
      :before {
        color: ${color2};
      }
    }
  }
  &.isRange > div {
    color: ${color1}
  }
  > div {
    &.on {
      color: ${color1}
    }
    &.off {
      color: #1a1a1a;
    }
  }
`;

const OptionBool = styled.div`
  :before {
    content: "";
    display: inline-block;
    border: 3px solid white;
    height: .75em;
    width: .75em;
    margin-right: 10px;
    position: relative;
    top: 4px;
  }
  &.true:before {
    background: ${color2}
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
      onClick={() => handleClick(typedId)}
    >
      {text}
    </div>
  );
};

const MainMenu: React.FC = () => {
  const {
    menuSettings: menu,
    updateMenuSettings,
    practiceSettings: settings,
    updatePracticeSettings: updateSettings,
    changeScreen
  } = useContext(EngineContext) as EngineContextObject;

  const { isRange, min, max } = settings.length;

  const isStoryMenuActive = () => ["story", "create", "load"].includes(menu.location);

  const handleMenuUpdate = (location: string) => {
    updateMenuSettings({ ...menu, location });
  };

  const handleToggleRange = (isRange: boolean) => {
    const newSettings = { ...settings };
    newSettings.length.isRange = isRange;
    updateSettings(newSettings);
  };

  const handleMinUpdate = (i: number) => {
    if (i > settings.length.max && isRange) return;
    const newSettings = { ...settings };
    newSettings.length.min = i;
    if (i > settings.length.max) settings.length.max = i;
    updateSettings(newSettings);
  };

  const handleMaxUpdate = (i: number) => {
    if (i < settings.length.min) return;
    const newSettings = { ...settings };
    newSettings.length.max = i;
    updateSettings(newSettings);
  };

  const handleToggleOptions = (bool: boolean, option: string) => {
    const optionKey = option as keyof typeof settings.options;
    const newSettings = { ...settings };
    newSettings.options[optionKey] = bool;
    updateSettings(newSettings);
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
          <h2>Start a new story ...</h2>
          <div>
            <label>TYPE a name!</label>
            <Input>{menu.storyName}</Input>
          </div>
          <Go onClick={() => console.log(menu.storyName, "start game with this name")}>Go!</Go>
        </MenuScreen>
      }
      {menu.location === "load" &&
        <MenuScreen>
          <h2>Load Story</h2>
          {menu.storyNames.map((storyName: string) =>
            <StoryName key={storyName}>{storyName}</StoryName>
          )}
        </MenuScreen>
      }
      {menu.location === "practice" &&
        <MenuScreen>
          <h2>Practice</h2>
          <h3>Key Pool</h3>
          <OptionGroup>
            <Option id="top" text="Top Row" />
            <Option id="home" text="Home Row" />
            <Option id="bottom" text="Bottom Row" />
            <Option id="numbers" text="Numbers" />
          </OptionGroup>
          <h3>Length of String</h3>
          <OptionGroup>
            <OptionBool
              className={isRange ? "true" : ""}
              onClick={() => handleToggleRange(!isRange)}
            >
              <small>range</small>
            </OptionBool>
          </OptionGroup>
          <OptionGroup className={isRange ? "min show" : "min"}>
            {[...Array(20)].map((num, i) =>
              <div
                key={i}
                onClick={() => handleMinUpdate(i + 1)}
                className={min === i + 1 ? "arrow" : ""}
              >
                {i + 1}
              </div>
            )}
          </OptionGroup>
          <OptionGroup className={isRange ? "isRange" : ""}>
            {[...Array(20)].map((num, i) =>
              <div
                key={i}
                onClick={() => {
                  if (!isRange) handleMinUpdate(i + 1);
                }}
                className={
                  min === i + 1 ? "on" :
                    (isRange && max < i + 1 || isRange && min > i) ? "off" : ""
                }
              >
                {i + 1}
              </div>
            )}
          </OptionGroup>
          <OptionGroup className={isRange ? "max show" : "max"}>
            {[...Array(20)].map((num, i) =>
              <div
                key={i}
                onClick={() => handleMaxUpdate(i + 1)}
                className={max === i + 1 ? "arrow" : ""}
              >
                {i + 1}
              </div>
            )}
          </OptionGroup>
          <h3>More Options</h3>
          <OptionGroup>
            <OptionBool
              className={settings.options.errors ? "true" : ""}
              onClick={() => handleToggleOptions(!settings.options.errors, "errors")}
            >
              <small>backspace errors</small>
            </OptionBool>
            <OptionBool
              className={settings.options.spaces ? "true" : ""}
              onClick={() => handleToggleOptions(!settings.options.spaces, "spaces")}
            >
              <small>spaces</small>
            </OptionBool>
            <OptionBool
              className={settings.options.capitals ? "true" : ""}
              onClick={() => handleToggleOptions(!settings.options.capitals, "capitals")}
            >
              <small>capitals</small>
            </OptionBool>
          </OptionGroup>
          <Go onClick={() => changeScreen("practice")}>Go!</Go>
        </MenuScreen>
      }
    </Flex>
  );
};

export default MainMenu;

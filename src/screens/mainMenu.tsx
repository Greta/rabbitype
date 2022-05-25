import React, { useContext } from "react";
import styled from "styled-components";
import EngineContext, { EngineContextObject } from "../modules/EngineContext";

const color1 = "cyan";
const color2 = "magenta";

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
      border-color: ${color1};
      color: ${color1};
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
    practiceSettings: settings,
    updatePracticeSettings: updateSettings,
    changeScreen
  } = useContext(EngineContext) as EngineContextObject;

  const handleMenuUpdate = (menu: string) => {
    updateSettings({ ...settings, menu });
  };

  const handleToggleRange = (isRange: boolean) => {
    const newSettings = { ...settings };
    newSettings.length.isRange = isRange;
    updateSettings(newSettings);
  };

  const handleMinUpdate = (i: number) => {
    const newSettings = { ...settings };
    newSettings.length.min = i;
    updateSettings(newSettings);
  };

  const handleMaxUpdate = (i: number) => {
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
        <h1>Rabbitype</h1>
        <Buttons>
          <div
            className={settings.menu === "story" ? "on" : ""}
            onClick={() => handleMenuUpdate("story")}>STORY</div>
          <div
            className={settings.menu === "practice" ? "on" : ""}
            onClick={() => handleMenuUpdate("practice")}>PRACTICE</div>
        </Buttons>
      </Menu>
      {settings.menu === "story" &&
        <SubMenu>
          <h2>[Story Track]</h2>
        </SubMenu>
      }
      {settings.menu === "practice" &&
        <SubMenu>
          <h2>Practice</h2>
          <h3>Key Pool</h3>
          <OptionGroup>
            <Option id="top" text="Top Row" />
            <Option id="home" text="Home Row" />
            <Option id="bottom" text="Bottom Row" />
            <Option id="numbers" text="Numbers" />
          </OptionGroup>
          <h3>Length of Segment</h3>
          <OptionGroup>
            <OptionBool
              className={settings.length.isRange ? "true" : ""}
              onClick={() => handleToggleRange(!settings.length.isRange)}
            >
              <small>range</small>
            </OptionBool><br /><br />
          </OptionGroup>
          <OptionGroup>
            {[...Array(20)].map((num, i) =>
              <div
                key={i}
                onClick={() => handleMinUpdate(i + 1)}
                className={
                  settings.length.min === i + 1 ? "on" :
                    settings.length.max < i + 2 ? "off" : ""
                }
              >
                {i + 1}
              </div>
            )}
          </OptionGroup>
          {settings.length.isRange &&
            <OptionGroup>
              {[...Array(20)].map((num, i) =>
                <div
                  key={i}
                  onClick={() => handleMaxUpdate(i + 1)}
                  className={
                    settings.length.max === i + 1 ? "on" :
                      settings.length.min > i ? "off" : ""
                  }
                >
                  {i + 1}
                </div>
              )}
            </OptionGroup>
          }
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
        </SubMenu>
      }
    </Flex>
  );
};

export default MainMenu;

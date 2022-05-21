import React from "react";
import { EngineProvider, Screen, Screens, TransitionElement } from ".";
import { Logo, MainMenu, Practice } from "../screens";

const Engine: React.FC = () => {
  const [screen, setScreen] = React.useState("logo");
  const [transitioning, setTransitioning] = React.useState(false);
  const [transition, setTransition] = React.useState("fade");
  const [gameSettings, updateGameSettings] = React.useState({
    length: 5
  });

  // TODO: set transition duration to a variable
  const changeScreen = (screen: string, transition = "fade") => {
    setTransitioning(true);
    setTransition(transition);

    setTimeout(() => {
      setScreen(screen);
    }, 250);

    setTimeout(() => {
      setTransitioning(false);
    }, 500);
  };

  return (
    <EngineProvider value={{
      screen,
      changeScreen,
      gameSettings,
      updateGameSettings
    }}>
      <Screens>
        <Screen id="logo" element={<Logo />} />
        <Screen id="mainMenu" element={<MainMenu />} />
        <Screen id="practice" element={<Practice />} />
      </Screens>
      {transitioning && 
        <TransitionElement transition={transition}></TransitionElement>
      }
    </EngineProvider>
  );
};

export default Engine;

import React from "react";
import { EngineProvider, Screen, Screens, TransitionElement } from ".";
import { LogoScreen, S1, S2 } from "../screens/test";

const Engine: React.FC = () => {
  const [screen, setScreen] = React.useState("logo");
  const [transitioning, setTransitioning] = React.useState(false);
  const [transition, setTransition] = React.useState("fade");

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
    <EngineProvider value={{screen, changeScreen}}>
      <Screens>
        <Screen id="logo" element={<LogoScreen />} />
        <Screen id="s1" element={<S1 />} />
        <Screen id="s2" element={<S2 />} />
      </Screens>
      {transitioning && 
        <TransitionElement transition={transition}></TransitionElement>
      }
    </EngineProvider>
  );
};

export default Engine;
import React from "react";
import { EngineProvider, Screen, Screens } from ".";
import { LogoScreen, S1, S2 } from "../screens/test";

const Engine: React.FC = () => {
  const [currentScreen, changeScreen] = React.useState("logo");

  return (
    <EngineProvider value={{currentScreen, changeScreen}}>
      <Screens>
        <Screen id="logo" element={<LogoScreen />} />
        <Screen id="s1" element={<S1 />} />
        <Screen id="s2" element={<S2 />} />
      </Screens>
    </EngineProvider>
  );
};

export default Engine;
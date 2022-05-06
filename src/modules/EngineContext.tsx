import React from "react";

export interface EngineContextObject {
  currentScreen: string;
  changeScreen: (screen: string) => void;
}

const EngineContext = React.createContext<EngineContextObject | null>(null);

export const EngineProvider = EngineContext.Provider;

export default EngineContext;

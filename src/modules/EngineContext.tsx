import React from "react";

export interface EngineContextObject {
  screen: string;
  changeScreen: (screen: string, transition?: string) => void;
}

const EngineContext = React.createContext<EngineContextObject | null>(null);

export const EngineProvider = EngineContext.Provider;

export default EngineContext;

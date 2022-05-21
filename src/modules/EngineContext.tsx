import React from "react";

interface settings {
  pool?: string;
  length: number;
}

export interface EngineContextObject {
  screen: string;
  changeScreen: (screen: string, transition?: string) => void;
  gameSettings: settings;
  updateGameSettings: (settings: settings) => void;
}

const EngineContext = React.createContext<EngineContextObject | null>(null);

export const EngineProvider = EngineContext.Provider;

export default EngineContext;

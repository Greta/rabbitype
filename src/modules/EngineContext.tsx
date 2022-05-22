import React from "react";

export interface PracticeSettingsProps {
  pool: {
    top: boolean,
    home: boolean,
    bottom: boolean,
    numbers: boolean,
  };
  length: number;
}

export interface EngineContextObject {
  screen: string;
  changeScreen: (screen: string, transition?: string) => void;
  practiceSettings: PracticeSettingsProps;
  updatePracticeSettings: (settings: PracticeSettingsProps) => void;
}

const EngineContext = React.createContext<EngineContextObject | null>(null);

export const EngineProvider = EngineContext.Provider;

export default EngineContext;

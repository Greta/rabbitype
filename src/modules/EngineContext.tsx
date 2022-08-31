import React from "react";

export interface MenuSettingsProps {
  location: string;
  storyName: string;
  storyNames: string[];
}

export interface PracticeSettingsProps {
  pool: {
    top: boolean;
    home: boolean;
    bottom: boolean;
    numbers: boolean;
  };
  length: {
    min: number;
    max: number;
    isRange: boolean;
  };
  options: {
    errors: boolean;
    spaces: boolean;
    capitals: boolean;
  }
}

export interface EngineContextObject {
  screen: string;
  changeScreen: (screen: string, transition?: string) => void;
  menuSettings: MenuSettingsProps;
  updateMenuSettings: (settings: MenuSettingsProps) => void;
  practiceSettings: PracticeSettingsProps;
  updatePracticeSettings: (settings: PracticeSettingsProps) => void;
}

const EngineContext = React.createContext<EngineContextObject | null>(null);

export const EngineProvider = EngineContext.Provider;

export default EngineContext;

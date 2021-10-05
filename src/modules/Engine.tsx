import React from "react";
import { EngineProvider, Screens } from ".";

const Engine: React.FC = () => {
  const defaults = {
    game: "values will go here."
  };

  return (
    <EngineProvider value={defaults}>
      <Screens />
    </EngineProvider>
  );
};

export default Engine;
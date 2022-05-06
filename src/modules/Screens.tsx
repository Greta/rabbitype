import React from "react";
import EngineContext, {EngineContextObject} from "./EngineContext";

interface ScreenProps {
  id: string;
  element: React.ReactNode | null;
}

export const Screen: React.FC<ScreenProps> = ({
  id, element
}) => {
  return (
    <div className="screen" id={id}>
      {element}
    </div>
  );
};

interface ScreensProps {
  children: React.ReactElement<ScreenProps>[];
}

const Screens: React.FC<ScreensProps> = ({
  children
}) => {
  const {currentScreen} = React.useContext(EngineContext) as EngineContextObject;
  const screen: React.ReactElement<ScreenProps>[] = [];

  React.Children.forEach(children, (child: React.ReactElement<ScreenProps>) => {
    if (currentScreen === child.props.id) {
      screen.push(child);
    }
  });

  return (
    <div>{screen}</div>
  );
};

export default Screens;

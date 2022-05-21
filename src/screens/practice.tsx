import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { EngineContext, EngineContextObject } from "../modules";

import backImg from "../assets/return.png";

const keys: Record<string, string> = {
  home: "asdfghjkl;'",
  top: "qwertyuiop",
  bottom: "zxcvbnm",
  all: "asdfghjklqwertyuiopzxcvbnm"
};

const Back = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  padding-right: 5px;
  &:hover {
    background: #1a1a1a;
  }
`;

const StyledScreen = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & h1, & h2 {
    margin: 15px;
  }
`;

const PracticeScreen: React.FC = () => {
  const {gameSettings: settings, changeScreen} = useContext(EngineContext) as EngineContextObject;
  const [str, setStr] = useState("");

  const createString = () => {
    const pool = keys[settings.pool ? settings.pool : "home"];

    let str = "";
    while (str.length < settings.length) {
      str += pool[Math.floor(Math.random() * pool.length)];
    }

    setStr(str);
  };

  const handleKeyDown = (e: KeyboardEvent) =>{
    // TODO: aknowledge user key strokes!
    console.log(e.key);
  };
  
  useEffect(() => {
    createString();
    document.addEventListener("keydown", handleKeyDown);
    return (): void => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div>
      <Back onClick={() => changeScreen("mainMenu")}>
        <img src={backImg} alt="back" />
      </Back>
      <StyledScreen>
        <h1>{str}</h1>

      </StyledScreen>
    </div>
  );
};

export default PracticeScreen;
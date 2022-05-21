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

const Letters = styled.div`
  font-size: 4em;
  letter-spacing: .15em;
  & > span:first-child {
    color: #470c29;
    text-shadow:
      5px 0px 0px #a31a5d,
      -5px 0px 0px #a31a5d,
      5px 5px 0px #a31a5d,
      5px -5px 0px #a31a5d,
      -5px 5px 0px #a31a5d,
      -5px -5px 0px #a31a5d;
  }
  & > span:last-child {
    color: black;
    text-shadow:
      5px 0px 0px #a31a5d,
      -5px 0px 0px #a31a5d,
      5px 5px 0px #a31a5d,
      5px -5px 0px #a31a5d,
      -5px 5px 0px #a31a5d,
      -5px -5px 0px #a31a5d;
  }
`;

const PracticeScreen: React.FC = () => {
  const {gameSettings: settings, changeScreen} = useContext(EngineContext) as EngineContextObject;
  const [str, setStr] = useState("");
  const [next, setNext] = useState("");
  const [progress, setProgress] = useState("");
  const [remaining, setRemaining] = useState("");
  const [pressed, setPressed] = useState("");

  const createString = () => {
    const pool = keys[settings.pool ? settings.pool : "home"];

    let str = "";
    while (str.length < settings.length) {
      str += pool[Math.floor(Math.random() * pool.length)];
    }

    return str;
  };

  const setupStr = () => {
    const newStr = createString();
    setStr(newStr);
    setRemaining(newStr);
    setProgress("");
    setNext(newStr.charAt(0));
  };

  const handleKeyDown = (e: KeyboardEvent) =>{
    setPressed(e.key + Date.now());
  };
  
  useEffect(() => {
    setupStr();
    document.addEventListener("keydown", handleKeyDown);
    return (): void => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (pressed[0] !== next) return;
    const newProgress = progress + next;
    setProgress(newProgress);
    setRemaining(str.slice(newProgress.length));

    if (newProgress.length === str.length) {
      // CELEBRATION HERE
      setTimeout(setupStr, 300);
    } else {
      setNext(str.charAt(newProgress.length));
    }
  }, [pressed]);

  return (
    <div>
      <Back onClick={() => changeScreen("mainMenu")}>
        <img src={backImg} alt="back" />
      </Back>
      <StyledScreen>
        <Letters>
          <span>{progress}</span>
          <span>{remaining}</span>
        </Letters>
      </StyledScreen>
    </div>
  );
};

export default PracticeScreen;
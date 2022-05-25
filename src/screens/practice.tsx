import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { EngineContext, EngineContextObject } from "../modules";

import backImg from "../assets/return.png";

const fill = "cyan";
const error = "yellow";
const outline = "magenta";

const keys: Record<string, string> = {
  home: "asdfghjkl;'",
  top: "qwertyuiop",
  bottom: "zxcvbnm",
  numbers: "1234567890",
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
  > span {
    color: black;
    text-shadow:
      5px 0px 0px ${outline},
      -5px 0px 0px ${outline},
      5px 5px 0px ${outline},
      5px -5px 0px ${outline},
      -5px 5px 0px ${outline},
      -5px -5px 0px ${outline};
      
    &.c {
      color: ${fill};
    }
    &.e {
      color: ${error};
    }
  }
`;

const PracticeScreen: React.FC = () => {
  const {practiceSettings: settings, changeScreen} = useContext(EngineContext) as EngineContextObject;
  const [str, setStr] = useState("");
  const [next, setNext] = useState("");
  const [progress, setProgress] = useState("");
  const [pressed, setPressed] = useState("");
  const [savedPool, setSavedPool] = useState("");

  const createString = (pool: string) => {
    const { min, max, isRange } = settings.length;
    const length = isRange ? Math.random() * (max - min) + min : min;

    let str = "";
    while (str.length < length) {
      str += pool[Math.floor(Math.random() * pool.length)];

      if (str === "_") str = "";
      if (str.length === length && str.charAt(-1) === "_") str = str.slice(0, -1);
    }

    return str;
  };

  const setupStr = (pool: string) => {
    const newStr = createString(pool);
    setStr(newStr);
    setProgress("");
    setNext(newStr.charAt(0));
  };

  const configurePool = () => {
    let pool = "";
    let key: keyof typeof settings.pool;
    for (key in settings.pool) {
      if (settings.pool[key]) {
        pool += keys[key];
      }
    }
    if (settings.options.capitals) pool += pool.toUpperCase();
    if (settings.options.spaces) pool += "____";
    setSavedPool(pool);
    setupStr(pool);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.repeat) return;
    if (e.key === "Alt" || e.key === "Control" || e.key === "Shift") return;
    setPressed(e.key + Date.now());
    if (e.key === "Backspace") {
      e.preventDefault();
      return false;
    }
  };
  
  useEffect(() => {
    configurePool();
    document.addEventListener("keydown", handleKeyDown);
    return (): void => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!pressed) return;

    const keyPress = pressed.slice(0, -13);
    let newProgress = progress;

    if (keyPress === "Backspace") {
      newProgress = progress.slice(0, -1);
    } else if (keyPress === next) {
      newProgress += "c";
    } else if (settings.options.errors) {
      newProgress += "e";
    }

    setProgress(newProgress.substring(0, str.length));

    if (newProgress.length === str.length && !/[e]/.test(newProgress)) {
      // CELEBRATION HERE
      setTimeout(() => setupStr(savedPool), 300);
    } else {
      const nextKey = str.charAt(newProgress.length);
      setNext(nextKey === "_" ? " " : nextKey);
    }
  }, [pressed]);

  return (
    <div>
      <Back onClick={() => changeScreen("mainMenu")}>
        <img src={backImg} alt="back" />
      </Back>
      <StyledScreen>
        <Letters>
          {str.split("").map((l, i) => <span key={i} className={progress.charAt(i)}>{l}</span>)}
        </Letters>
      </StyledScreen>
    </div>
  );
};

export default PracticeScreen;
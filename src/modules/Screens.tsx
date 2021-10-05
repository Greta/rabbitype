import React from "react";
import styled from "styled-components";

import logo from "../assets/logo.gif";

const Screen = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  > img {
    height: 100vmin;
  };
`;

const Screens: React.FC = () => {
  return (
    <div className="screens">
      <Screen>
        <img src={logo} alt="logo" />
      </Screen>
    </div>
  );
};

export default Screens;

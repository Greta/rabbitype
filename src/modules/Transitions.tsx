import styled, { keyframes, css } from "styled-components";

// TODO: add different transitions!
const fade = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

interface TransitionElementProps {
  transition: string;
}

const TransitionElement = styled.div<TransitionElementProps>`
  min-height: 100vh;
  min-width: 100vw;
  position: absolute;
  top: 0;
  background: #000;
  ${props => {
    switch (props.transition) {
    case "fade":
      return css`
        opacity: 0;
        animation: 0.5s ${fade} linear;
      `;
    default:
      return css`
        animation-name: ${fade};
      `;
    }
  }}
`;

export default TransitionElement;
import { css, keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { NumericFormat, PatternFormat } from "react-number-format";

export type ErrorProp = string | null;

const BASE = 3;
const SIZE = `${BASE}px`;
const PRIMARY = "#4096ff";
const PRIMARY_SHADOW = "0 0 0 2px rgba(5, 145, 255, 0.1)";
const BORDER_COLOR = "#d9d9d9";
const LIGHTER = "#b5b5b5";
const DARKER = "#343536";
const DANGER = "#c62828";
const FONT_SIZE = {
  Label: "16px",
};

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-size: ${FONT_SIZE.Label};

  span {
    font-weight: normal;
    font-size: 0.85em;
    margin-top: 0.5em;
  }
`;

const numericStyle = css`
  display: flex;
  align-items: center;
  height: 30px;
  padding: 0 11px;
  border: 1px solid ${BORDER_COLOR};
  border-radius: 6px;

  &:focus-visible {
    outline: none;
    border-color: ${PRIMARY};
    box-shadow: ${PRIMARY_SHADOW};
  }
`;

export const CardInput = styled(PatternFormat)`
  ${numericStyle}
`;

export const NumericPlain = styled(NumericFormat)`
  ${numericStyle}
`;

export const NumericFormatStyled = styled(NumericFormat)`
  text-align: right;
  border: none;
  padding: 0;
  background-color: transparent;
  font-size: ${FONT_SIZE.Label};
  width: 140px;

  &:focus-visible {
    outline: none;
  }

  &:disabled {
    opacity: 0.3;
  }
`;

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 450px;
  margin: 0 auto;
  color: #6c6f80;
  font-family: "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol";
`;

export const H1 = styled.h1`
  font-size: 24px;
`;

export const Button = styled.button`
  font-size: 1.2em;
  padding: 0.5em 1em;
  background-color: #a3c644;
  color: white;
  border: none;
  border-radius: 9px;

  &:focus-visible {
    outline: none;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: #eff4f8;
  border-radius: 9px;
  font-size: 12px;

  &:not(:last-of-type) {
    margin-bottom: 16px;
  }
`;

export const Row = styled.div`
  display: flex;
`;

export const Error = styled.div`
  display: flex;
  justify-content: flex-end;
  color: ${DANGER};
  font-size: 0.85em;
`;

export const indicator = keyframes`
  0% {
    box-shadow: -${BASE}px 0 0 ${LIGHTER}, -${BASE * 3}px 0 0 ${DARKER},
      -${BASE * 5}px 0 0 ${DARKER};
  }

  50% {
    box-shadow: -${BASE}px 0 0 ${DARKER}, -${BASE * 3}px 0 0 ${LIGHTER},
      -${BASE * 5}px 0 0 ${DARKER};
  }

  100% {
    box-shadow: -${BASE}px 0 0 ${DARKER}, -${BASE * 3}px 0 0 ${DARKER},
      -${BASE * 5}px 0 0 ${LIGHTER};
  }
`;

export const Container = styled.div<{ isLoading?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;

  &::after {
    content: "";
    display: ${({ isLoading = false }) => (isLoading ? "block" : "none")};
    position: absolute;
    width: ${SIZE};
    height: ${SIZE};
    border-radius: 50%;
    bottom: 0;
    right: -${SIZE};
    transform: translateY(100%);
    animation: ${indicator} 600ms linear infinite alternate;
  }
`;

export const Contained = styled(Container)`
  &::after {
    right: unset;
    left: 29px;
    bottom: 7px;
  }
`;

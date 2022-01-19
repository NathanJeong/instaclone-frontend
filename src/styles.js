import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const darkTheme = {
  fontColor: "#2c2c2c",
  bgColor: "lightgrey",
};
export const lightTheme = {
  fontColor: "lightgrey",
  bgColor: "#2c2c2c",
};

export const GlobalStyles = createGlobalStyle`
    ${reset}
    body {
        background-color: ${(props) => props.theme.bgColor};
    }
`;

import { useReactiveVar } from "@apollo/client";
import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { darkMoveVar, disableDarkMode, enableDarkMode } from "../../apollo";

const Container = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const Wrapper = styled.div`
  max-width: 350px;
  width: 100%;
`;
const Foorter = styled.div`
  margin-top: 20px;
`;
const DarkModeBtn = styled.span`
  cursor: pointer;
`;

function AuthLayout({ children }) {
  const darkMode = useReactiveVar(darkMoveVar);
  return (
    <Container>
      <Wrapper>{children}</Wrapper>
      <Foorter>
        <DarkModeBtn onClick={darkMode ? disableDarkMode : enableDarkMode}>
          <FontAwesomeIcon
            icon={darkMode ? faSun : faMoon}
            color={`${(props) => props.theme.fontColor}`}
          />
        </DarkModeBtn>
      </Foorter>
    </Container>
  );
}
export default AuthLayout;

import styled from "styled-components";
import { darkMoveVar, isLoggedInVar } from "../apollo";

const Container = styled.div``;
const Title = styled.h1`
  font-size: 25px;
  color: ${(props) => props.theme.fontColor};
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;

function Login({ setIsLoggedIn }) {
  return (
    <Container>
      <Title>Login</Title>
      <button onClick={() => isLoggedInVar(true)}>Login</button>
      <button onClick={() => darkMoveVar(true)}>to dark</button>
      <button onClick={() => darkMoveVar(false)}>to light</button>
    </Container>
  );
}
export default Login;

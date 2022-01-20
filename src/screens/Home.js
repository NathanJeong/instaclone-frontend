import styled from "styled-components";
import { logUserOut } from "../apollo";

const Title = styled.h1`
  font-size: 25px;
  color: bisque;
`;

function Home({ setIsLoggedIn }) {
  return (
    <div>
      <Title>Home Page</Title>
      <button onClick={() => logUserOut()}>Log out</button>
    </div>
  );
}

export default Home;

import {
  faFacebookSquare,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import styled from "styled-components";
import AuthLayout from "../components/auth/AuthLayout";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import Input from "../components/auth/Input";
import Separator from "../components/auth/Separator";
import PageTitle from "../components/PageTitle";
import { FatLink } from "../components/shared";
import routes from "../routes";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Subtitle = styled(FatLink)`
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`;
const FacebookLogin = styled.div`
  border-radius: 4px;
  width: 100%;
  margin-top: 10px;
  padding: 10px 10px;
  background-color: ${(props) => props.theme.accent};
  color: white;
  text-align: center;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;

function SignUp() {
  return (
    <AuthLayout>
      <PageTitle title="Sign Up" />
      <FormBox>
        <HeaderContainer>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
          <Subtitle>
            Sign up to see photos and videos from your firends
          </Subtitle>
        </HeaderContainer>
        <FacebookLogin>
          <FontAwesomeIcon icon={faFacebookSquare} />
          <span>Log in with Facebook</span>
        </FacebookLogin>
        <Separator />
        <form>
          <Input type="text" placeholder="Email" />
          <Input type="text" placeholder="Name" />
          <Input type="text" placeholder="Username" />
          <Input type="password" placeholder="Password" />
          <Button type="submit" value="Sign Up" />
        </form>
      </FormBox>
      <BottomBox cta="Have an account?" linkText="Login" link={routes.home} />
    </AuthLayout>
  );
}
export default SignUp;

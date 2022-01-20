import { useMutation, gql } from "@apollo/client";
import {
  faFacebookSquare,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import styled from "styled-components";
import AuthLayout from "../components/auth/AuthLayout";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import FormError from "../components/auth/FormError";
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
const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $email: String!
    $firstName: String!
    $lastName: String!
    $userName: String!
    $nationality: String!
    $password: String!
  ) {
    createAccount(
      email: $email
      firstName: $firstName
      lastName: $lastName
      userName: $userName
      nationality: $nationality
      password: $password
    ) {
      success
      error
    }
  }
`;

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    setError,
  } = useForm({ mode: "onChange" });
  const history = useHistory();

  const onCompleted = (data) => {
    const {
      createAccount: { success, error },
    } = data;
    if (!success) {
      return setError("result", {
        message: error,
      });
    }
    history.push(routes.home);
  };
  const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });

  const onSubmitValid = (data) => {
    if (loading) {
      return;
    }
    const { email, firstName, lastName, userName, nationality, password } =
      getValues();
    createAccount({
      variables: {
        email,
        firstName,
        lastName,
        userName,
        nationality,
        password,
      },
    });
  };

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
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("email", { required: "Email is Required" })}
            type="email"
            placeholder="Email"
            hasError={Boolean(errors?.email?.message)}
          />
          <FormError message={errors?.email?.message} />
          <Input
            {...register("firstName", { required: "FirstName is Required" })}
            type="text"
            placeholder="FirstName"
            hasError={Boolean(errors?.firstName?.message)}
          />
          <FormError message={errors?.firstName?.message} />
          <Input
            {...register("lastName", { required: "LastName is Required" })}
            type="text"
            placeholder="LastName"
            hasError={Boolean(errors?.lastName?.message)}
          />
          <FormError message={errors?.lastName?.message} />
          <Input
            {...register("userName", { required: "Username is Required" })}
            type="text"
            placeholder="UserName"
            hasError={Boolean(errors?.userName?.message)}
          />
          <FormError message={errors?.userName?.message} />
          <Input
            {...register("nationality", {
              required: "Nationality is Required",
            })}
            type="text"
            placeholder="Nationality"
            hasError={Boolean(errors?.nationality?.message)}
          />
          <FormError message={errors?.nationality?.message} />
          <Input
            {...register("password", { required: "Password is Required" })}
            type="password"
            placeholder="Password"
            hasError={Boolean(errors?.password?.message)}
          />
          <FormError message={errors?.password?.message} />
          <Button
            type="submit"
            value={loading ? "Loading..." : "Sign Up"}
            disabled={!isValid || loading}
          />
        </form>
      </FormBox>
      <BottomBox cta="Have an account?" linkText="Login" link={routes.home} />
    </AuthLayout>
  );
}
export default SignUp;

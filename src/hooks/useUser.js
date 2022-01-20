import { useReactiveVar, gql, useQuery } from "@apollo/client";
import { isLoggedInVar } from "../apollo";

const ME_QUERY = gql`
  query me {
    me {
      userName
      avatar
    }
  }
`;
function useUser() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { data, error } = useQuery(ME_QUERY, {
    skip: !isLoggedIn,
  });
  console.log(data, error);
  return;
}
export default useUser;

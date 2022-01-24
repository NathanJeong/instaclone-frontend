import { useParams } from "react-router";

function Profile() {
  const { userName } = useParams();
  console.log(userName);
  return "Profile";
}
export default Profile;

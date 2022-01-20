import styled from "styled-components";

const SAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid blue;
  background-color: ${(props) => props.theme.avatarColor};
  overflow: hidden;
`;
const Img = styled.img`
  max-width: 100%;
`;
function Avatar({ url = "" }) {
  return <SAvatar>{url !== "" ? <Img src={url} /> : null}</SAvatar>;
}
export default Avatar;

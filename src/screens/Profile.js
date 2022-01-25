import { useParams } from "react-router";
import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { PHOTO_FRAGMENT } from "../fragments";
import styled from "styled-components";
import { FatText } from "../components/shared";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../components/auth/Button";
import PageTitle from "../components/PageTitle";

const SEE_PROFILE_QUERY = gql`
  query seeProfile($userName: String!) {
    seeProfile(userName: $userName) {
      firstName
      lastName
      userName
      email
      bio
      avatar
      photos {
        ...PhotoFragment
      }
      nationality
      totalFollowing
      totalFollowers
      isMe
      isFollowing
    }
  }
  ${PHOTO_FRAGMENT}
`;
const FOLLOW_USER_MUTATION = gql`
  mutation followUser($userName: String!) {
    followUser(userName: $userName) {
      success
    }
  }
`;
const UNFOLLOW_USER_MUTATION = gql`
  mutation unfollowUser($userName: String!) {
    unfollowUser(userName: $userName) {
      success
    }
  }
`;
const Header = styled.div`
  display: flex;
`;
const Avatar = styled.img`
  margin-left: 50px;
  height: 160px;
  width: 160px;
  border-radius: 50%;
  margin-right: 150px;
  background-color: #2c2c2c;
`;
const Column = styled.div``;
const Username = styled.h3`
  font-size: 28px;
  font-weight: 400;
  width: 100%;
`;
const Row = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  display: flex;
`;
const List = styled.ul`
  display: flex;
`;
const Item = styled.li`
  margin-right: 20px;
`;
const Value = styled(FatText)`
  font-size: 18px;
`;
const Name = styled(FatText)`
  font-size: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-auto-rows: 290px;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 50px;
`;

const Photo = styled.div`
  background-image: url(${(props) => props.bg});
  background-size: cover;
  position: relative;
`;

const Icons = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;

const Icon = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
  margin: 0px 5px;
  svg {
    font-size: 14px;
    margin-right: 5px;
  }
`;
const ProfileBtn = styled(Button).attrs({
  as: "span",
})`
  margin-left: 10px;
  margin-top: 0px;
  align-items: center;
  justify-content: center;
  display: flex;
  padding: 8px 10px;
  cursor: pointer;
`;
function Profile() {
  const { userName } = useParams();
  const client = useApolloClient();
  const { data, loading } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      userName,
    },
  });

  const unfollowUserUpdate = (cache, result) => {
    const {
      data: {
        unfollowUser: { success },
      },
    } = result;
    if (!success) {
      return;
    }
    cache.modify({
      id: `User:${userName}`,
      fields: {
        isFollowing(prev) {
          return false;
        },
        totalFollowers(prev, { readField }) {
          if (readField("isFollowing")) {
            return prev - 1;
          }
        },
      },
    });
  };
  const [unfollowUserMutation] = useMutation(UNFOLLOW_USER_MUTATION, {
    variables: {
      userName,
    },
    update: unfollowUserUpdate,
  });
  const followUserCompleted = (data) => {
    const {
      followUser: { success },
    } = data;
    if (!success) {
      return;
    }
    const { cache } = client;
    cache.modify({
      id: `User:${userName}`,
      fields: {
        isFollowing(prev) {
          return true;
        },
        totalFollowers(prev, { readField }) {
          if (readField("isFollowing")) {
            return prev + 1;
          }
        },
      },
    });
  };
  const [followUserMutation] = useMutation(FOLLOW_USER_MUTATION, {
    variables: {
      userName,
    },
    onCompleted: followUserCompleted,
  });
  const getButton = (seeProfile) => {
    const { isMe, isFollowing } = seeProfile;
    if (isMe) {
      return <ProfileBtn>Edit Profile</ProfileBtn>;
    }
    if (isFollowing) {
      return <ProfileBtn onClick={unfollowUserMutation}>Unfollow</ProfileBtn>;
    } else {
      return <ProfileBtn onClick={followUserMutation}>Follow</ProfileBtn>;
    }
  };
  return (
    <div>
      <PageTitle
        title={
          loading ? "Loading..." : `${data?.seeProfile?.userName}'s Profile'`
        }
      />
      <Header>
        <Avatar src={data?.seeProfile?.avatar} />
        <Column>
          <Row>
            <Username>{data?.seeProfile?.userName}</Username>
            {data?.seeProfile ? getButton(data.seeProfile) : null}
          </Row>
          <Row>
            <List>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowers}</Value> followers
                </span>
              </Item>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowing}</Value> following
                </span>
              </Item>
            </List>
          </Row>
          <Row>
            <Name>
              {data?.seeProfile?.firstName}
              {"  "}
              {data?.seeProfile?.lastName}
            </Name>
          </Row>
          <Row>{data?.seeProfile?.bio}</Row>
        </Column>
      </Header>
      <Grid>
        {data?.seeProfile?.photos.map((photo) => (
          <Photo key={photo.id} bg={photo.file}>
            <Icons>
              <Icon>
                <FontAwesomeIcon icon={faHeart} />
                {photo.likes}
              </Icon>
              <Icon>
                <FontAwesomeIcon icon={faComment} />
                {photo.commentNumber}
              </Icon>
            </Icons>
          </Photo>
        ))}
      </Grid>
    </div>
  );
}
export default Profile;

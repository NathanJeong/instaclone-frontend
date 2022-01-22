import { gql, useMutation, useQuery } from "@apollo/client";
import { PropTypes } from "prop-types";
import styled from "styled-components";
import { FatText } from "../shared";
import {
  faBookmark,
  faComment,
  faHeart,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as SolidHeart } from "@fortawesome/free-solid-svg-icons";
import Avatar from "../Avatar";
import Comments from "./Comments";

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      success
      error
    }
  }
`;

const PhotoContainer = styled.div`
  background-color: white;
  border: 1px solid ${(props) => props.theme.borderColor};
  margin-bottom: 60px;
  max-width: 620px;
  border-radius: 5px;
`;
const PhotoHeader = styled.div`
  padding: 15px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(239, 239, 239);
`;
const Username = styled(FatText)`
  margin-left: 15px;
`;
const PhotoFile = styled.img`
  min-width: 100%;
  max-width: 100%;
`;
const PhotoData = styled.div`
  padding: 12px 15px;
`;
const PhotoActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    display: flex;
    align-items: center;
  }
  svg {
    font-size: 20px;
  }
`;
const PhotoAction = styled.div`
  margin-right: 10px;
  cursor: pointer;
`;
const Likes = styled(FatText)`
  margin-top: 10px;
  display: block;
`;

function Photo({
  id,
  likes,
  isLiked,
  file,
  user,
  caption,
  comments,
  commentNumber,
}) {
  const updateToggleLike = (cache, result) => {
    const {
      data: {
        toggleLike: { success },
      },
    } = result;
    if (success) {
      const fragmentId = `Photo:${id}`;
      const fragment = gql`
        fragment BSName on Photo {
          isLiked
          likes
        }
      `;
      const result = cache.readFragment({
        id: fragmentId,
        fragment,
      });
      if ("isLiked" in result && "likes" in result) {
        const { isLiked: cacheIsLiked, likes: cacheLikes } = result;
        cache.writeFragment({
          id: fragmentId,
          fragment,
          data: {
            isLiked: !cacheIsLiked,
            likes: cacheIsLiked ? cacheLikes - 1 : cacheLikes + 1,
          },
        });
      }
    }
  };
  const [toggleLikeMutation, { loading }] = useMutation(TOGGLE_LIKE_MUTATION, {
    variables: {
      id,
    },
    update: updateToggleLike,
  });
  return (
    <PhotoContainer key={id}>
      <PhotoHeader>
        <Avatar lg url={user.avatar} />
        <Username>{user.userName}</Username>
      </PhotoHeader>
      <PhotoFile src={file} />
      <PhotoData>
        <PhotoActions>
          <div>
            <PhotoAction>
              <FontAwesomeIcon
                onClick={toggleLikeMutation}
                style={{ color: isLiked ? "tomato" : "inherit" }}
                icon={isLiked ? SolidHeart : faHeart}
              />
            </PhotoAction>
            <PhotoAction>
              <FontAwesomeIcon icon={faComment} />
            </PhotoAction>
            <PhotoAction>
              <FontAwesomeIcon icon={faPaperPlane} />
            </PhotoAction>
          </div>
          <div>
            <FontAwesomeIcon icon={faBookmark} />
          </div>
        </PhotoActions>
        <Likes>{likes === 1 ? "1 like" : `${likes} likes`}</Likes>
        <Comments
          author={user.userName}
          comments={comments}
          caption={caption}
          commentNumber={commentNumber}
        />
      </PhotoData>
    </PhotoContainer>
  );
}
Photo.propTypes = {
  id: PropTypes.number.isRequired,
  likes: PropTypes.number.isRequired,
  isLiked: PropTypes.bool.isRequired,
  file: PropTypes.string.isRequired,
  user: PropTypes.shape({
    avatar: PropTypes.string,
    userName: PropTypes.string.isRequired,
  }),
};
export default Photo;

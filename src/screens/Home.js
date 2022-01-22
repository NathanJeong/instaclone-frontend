import { gql, useQuery } from "@apollo/client";
import Photo from "../components/feed/Photo";
import PageTitle from "../components/PageTitle";

const FEED_QUERY = gql`
  query seeFeed {
    seeFeed {
      id
      user {
        userName
        avatar
      }
      file
      caption
      likes
      commentNumber
      comments {
        id
        user {
          userName
          avatar
        }
        payload
        isMine
        createdAt
      }
      createdAt
      isMine
      isLiked
    }
  }
`;

function Home() {
  const { data } = useQuery(FEED_QUERY);
  return (
    <div>
      <PageTitle title="Home" />
      {data?.seeFeed?.map((photo) => (
        <Photo
          key={photo.id}
          id={photo.id}
          likes={photo.likes}
          isLiked={photo.isLiked}
          file={photo.file}
          user={photo.user}
          caption={photo.caption}
          commentNumber={photo.commentNumber}
          comments={photo.comments}
          // {...photo}
        />
      ))}
    </div>
  );
}

export default Home;

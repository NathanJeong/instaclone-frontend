import { useMutation, gql } from "@apollo/client";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FatText } from "../shared";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import useUser from "../../hooks/useUser";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen, faTimes } from "@fortawesome/free-solid-svg-icons";

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      success
    }
  }
`;
const EDIT_COMMENT_MUTATION = gql`
  mutation editComment($id: Int!, $payload: String!) {
    editComment(id: $id, payload: $payload) {
      success
      error
    }
  }
`;
const CommentContainer = styled.div`
  margin-top: 10px;
  display: flex;
`;
const CaptionContainer = styled.div`
  display: flex;
  width: 90%;
  justify-content: space-between;
  align-items: center;
`;
const CommentCaption = styled.span`
  margin-left: 10px;
  a {
    background-color: inherit;
    color: ${(props) => props.theme.accent};
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;
const ButtonContainer = styled.div`
  display: flex;
`;

const EditForm = styled.form`
  display: flex;
  align-items: center;
  margin-left: 5px;
  width: 100%;
`;

const EditInput = styled.input`
  width: 100%;
  height: 1rem;
`;

const EditButton = styled.button`
  all: unset;
  font-size: 12px;
  opacity: 0.3;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`;

const EditedBtn = styled.button`
  width: 3rem;
  border: none;
  background-color: inherit;
  font-size: 10px;
  color: ${(props) => props.theme.accent};
  opacity: ${(props) => (props.valid ? "0.3" : "1")};
  cursor: ${(props) => (props.valid ? "" : "pointer")};
`;

const DeleteButton = styled.button`
  all: unset;
  font-size: 0.7rem;
  opacity: 0.3;
  margin-left: 0.5rem;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`;
const Username = styled.div`
  width: 10%;
  margin-right: 5px;
`;

function Comment({ id, isMine, photoId, author, payload }) {
  const { data: userData } = useUser();
  const [onEditing, setOnEditing] = useState(false);
  const { register, handleSubmit, getValues, watch, setValue } = useForm({
    defaultValues: {
      edit: payload,
    },
  });
  const editedPayload = getValues("edit");
  const updateDeleteComment = (cache, result) => {
    const {
      data: {
        deleteComment: { success },
      },
    } = result;
    if (success) {
      cache.evict({
        id: `Comment:${id}`,
      });
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          commentNumber(prev, { readField }) {
            if (readField("commentNumber")) {
              return prev - 1;
            }
          },
        },
      });
    }
  };
  const updateEditComment = (cache, result) => {
    const {
      data: {
        editComment: { success },
      },
    } = result;
    if (success && userData?.me) {
      const editedComment = {
        __typename: "Comment",
        updatedAt: Date.now() + "",
        id,
        isMine: true,
        payload,
        user: {
          ...userData.me,
        },
      };
      const newCacheComment = cache.writeFragment({
        data: editedComment,
        fragment: gql`
          fragment BSName on Comment {
            id
            updatedAt
            isMine
            payload
            user {
              userName
              avatar
            }
          }
        `,
      });
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          comments(prev) {
            const remain = prev.filter(
              (comment) => comment.__ref !== `Comment:${id}`
            );
            return [...remain, newCacheComment];
          },
        },
      });
      setOnEditing(false);
    }
  };
  const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION, {
    variables: {
      id,
    },
    update: updateDeleteComment,
  });
  const [editCommentMutation] = useMutation(EDIT_COMMENT_MUTATION, {
    variables: {
      id,
      payload: editedPayload,
    },
    update: updateEditComment,
  });
  const onDeleteClick = () => {
    deleteCommentMutation();
  };
  const onEditClick = () => {
    setOnEditing(true);
  };
  const cancleEditing = () => {
    setOnEditing(false);
    setValue("edit", payload);
  };
  const onEditValid = () => {
    editCommentMutation();
  };
  return (
    <CommentContainer>
      <Username>
        <Link to={`/users/${author}`}>
          <FatText>{author}</FatText>
        </Link>
      </Username>
      <CaptionContainer>
        {isMine &&
          (onEditing ? (
            <EditForm onSubmit={handleSubmit(onEditValid)}>
              <EditInput
                type="text"
                {...register("edit", { required: true })}
              />
              <EditedBtn valid={!Boolean(watch("edit"))}>수정</EditedBtn>
            </EditForm>
          ) : null)}
        {onEditing ? null : (
          <CommentCaption>
            {payload &&
              payload.split(" ").map((word, index) =>
                /#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/.test(word) ? (
                  <React.Fragment key={index}>
                    <Link to={`/hashtag/${word}`}>{word}</Link>{" "}
                  </React.Fragment>
                ) : (
                  <React.Fragment key={index}>{word} </React.Fragment>
                )
              )}
          </CommentCaption>
        )}
        {isMine ? (
          <React.Fragment>
            {onEditing ? (
              <ButtonContainer>
                <EditButton onClick={cancleEditing}>
                  <FontAwesomeIcon icon={faTimes} />
                </EditButton>
              </ButtonContainer>
            ) : (
              <ButtonContainer>
                <EditButton onClick={onEditClick}>
                  <FontAwesomeIcon icon={faPen} />
                </EditButton>
                <DeleteButton onClick={onDeleteClick}>
                  <FontAwesomeIcon icon={faTrash} />
                </DeleteButton>
              </ButtonContainer>
            )}
          </React.Fragment>
        ) : null}
      </CaptionContainer>
    </CommentContainer>
  );
}

Comment.propTypes = {
  id: PropTypes.number,
  isMine: PropTypes.bool,
  photoId: PropTypes.number,
  author: PropTypes.string.isRequired,
  payload: PropTypes.string.isRequired,
};

export default Comment;

import gql from "graphql-tag";

export const MY_BOARDS_QUERY = gql`
  query {
    boards {
      id
      name
      background
    }
  }
`;

export const BOARD_QUERY = gql`
  query ($id: ID!) {
    board(id: $id) {
      id
      name
      background
      lists {
        name
        id
        cards {
          title
          id
        }
      }
    }
  }
`;

export const CREATE_BOARD_MUTATION = gql`
  mutation createBoard($name: String!, $background: String!) {
    createBoard(name: $name, background: $background) {
      id
      name
      background
    }
  }
`;

export const CREATE_LIST_MUTATION = gql`
  mutation createList($name: String!, $board_id: ID!) {
    createList(name: $name, board_id: $board_id) {
      id
      name
    }
  }
`;

export const CREATE_CARD_MUTATION = gql`
  mutation createCard($title: String!, $description: String!, $list_id: ID!) {
    createCard(title: $title, description: $description, list_id: $list_id) {
      id
      title
    }
  }
`;

export const MOVE_CARD_MUTATION = gql`
  mutation moveCard($card_id: ID!, $list_id: ID!) {
    moveCard(card_id: $card_id, list_id: $list_id) {
      id
      title
    }
  }
`;

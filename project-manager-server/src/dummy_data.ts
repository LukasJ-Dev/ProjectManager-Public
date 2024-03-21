/*
User:
- id (pk)
- email
- first_name
- last_name
- password
- profile_image

Board:
- id (pk)
- belongs_to (fk: User)
- name
- background

List:
- id (pk)
- name
- board (fk: Board)

Card:
- id (pk)
- title
- List (fk: List)
- Description
- Labels [fk: Label]

Label:
- id (pk)
- name
- color
- Board (fk: board)


*/
const users = [
  {
    id: 1,
    email: "user1@example.com",
    first_name: "John",
    last_name: "Doe",
    password: "password1",
    profile_image: "profile1.jpg",
  },
  {
    id: 2,
    email: "user2@example.com",
    first_name: "Jane",
    last_name: "Smith",
    password: "password2",
    profile_image: "profile2.jpg",
  },
];

const boards = [
  {
    id: 1,
    belongs_to: 1,
    name: "Board 1",
    background: "bg1.jpg",
  },
  {
    id: 2,
    belongs_to: 1,
    name: "Board 2",
    background: "bg2.jpg",
  },
  {
    id: 3,
    belongs_to: 2,
    name: "Board 3",
    background: "bg3.jpg",
  },
];

const lists = [
  {
    id: 1,
    name: "List 1",
    board: 1,
  },
  {
    id: 2,
    name: "List 2",
    board: 1,
  },
  {
    id: 3,
    name: "List 3",
    board: 2,
  },
];

const cards = [
  {
    id: 1,
    title: "Card 1",
    list: 1,
    description: "Description for Card 1",
    labels: [1, 2],
  },
  {
    id: 2,
    title: "Card 2",
    list: 1,
    description: "Description for Card 2",
    labels: [3],
  },
  {
    id: 3,
    title: "Card 3",
    list: 2,
    description: "Description for Card 3",
    labels: [1],
  },
];

const labels = [
  {
    id: 1,
    name: "Label 1",
    color: "red",
    board: 1,
  },
  {
    id: 2,
    name: "Label 2",
    color: "blue",
    board: 1,
  },
  {
    id: 3,
    name: "Label 3",
    color: "green",
    board: 2,
  },
];

export { users, boards, lists, cards, labels };

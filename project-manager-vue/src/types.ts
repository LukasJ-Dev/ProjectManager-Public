export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string;
}

export interface Board {
  id: string;
  name: string;
  background: string;
}

export interface List {
  id: string;
  name: string;
  cards: Card[];
}

export interface Card {
  id: string;
  title: string;
  description: string;
}

export interface OpenedBoard {
  id: string;
  name: string;
  background: string;
  lists: List[];
}

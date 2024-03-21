import { defineStore } from "pinia";
import { Board, User, OpenedBoard, List, Card } from "../types";

export const useStore = defineStore("main", {
  state: () => ({
    isLoggedIn: false,
    user: null as User | null,
    boards: [] as Board[],
    openedBoard: null as OpenedBoard | null,
  }),
  actions: {
    login(user: User) {
      this.isLoggedIn = true;
      this.user = user;
    },
    logout() {
      this.isLoggedIn = false;
      this.user = null;
    },
    setBoards(boards: Board[]) {
      this.boards = boards;
    },
    addBoard(board: Board) {
      this.boards = [...this.boards, board];
    },
    setOpenedBoard(board: OpenedBoard) {
      this.openedBoard = board;
    },
    addList(list: List) {
      if (!this.openedBoard) return;
      this.openedBoard = {
        ...this.openedBoard,
        lists: [...this.openedBoard.lists, list],
      };
    },
    addCard(payload: { listId: string; card: Card }) {
      if (!this.openedBoard) return;
      const updatedLists = this.openedBoard.lists.map((list) => {
        if (list.id === payload.listId) {
          return {
            ...list,
            cards: [...list.cards, payload.card],
          };
        }
        return list;
      });
      this.openedBoard = {
        ...this.openedBoard,
        lists: updatedLists,
      };
    },
    moveCard(payload: { card: Card; listId: string }) {
      if (!this.openedBoard) return;
      const updatedLists = this.openedBoard.lists.map((list) => {
        const updatedCards = list.cards.filter(
          (card) => card.id !== payload.card.id
        );
        if (list.id === payload.listId) {
          return {
            ...list,
            cards: [...updatedCards, payload.card],
          };
        }
        return {
          ...list,
          cards: updatedCards,
        };
      });
      this.openedBoard = {
        ...this.openedBoard,
        lists: updatedLists,
      };
    },
  },
});

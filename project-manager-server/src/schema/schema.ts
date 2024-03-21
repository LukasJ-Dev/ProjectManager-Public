import { users, boards, lists, cards, labels } from "../dummy_data";

import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { Context } from "../types";

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    profile_image: { type: GraphQLString },
  }),
});

const BoardType = new GraphQLObjectType({
  name: "Board",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    background: { type: GraphQLString },
    lists: { type: new GraphQLList(ListType) },
  }),
});

const ListType = new GraphQLObjectType({
  name: "List",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    cards: { type: new GraphQLList(CardType) },
  }),
});

const CardType = new GraphQLObjectType({
  name: "Card",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
  }),
});

const LabelType = new GraphQLObjectType({
  name: "Label",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    color: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return users.find((user) => user.id == args.id);
      },
    },
    boards: {
      type: new GraphQLList(BoardType), // multiple boards
      async resolve(parent, args, context: Context) {
        const { user, prisma } = context;

        if (!user) {
          throw new Error("You must be logged in to view your boards");
        }
        // You can view boards -> lists -> cards
        let boards = await prisma.board.findMany({
          where: { belongs_to: { id: user.id } },
          include: {
            lists: {
              include: {
                cards: true,
              },
            },
          },
        });

        return boards;
      },
    },
    board: {
      type: BoardType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args, context: Context) {
        const { user, prisma } = context;
        if (!user) {
          throw new Error("You must be logged in to view a board");
        }
        // The board must belong to the user
        const board = await prisma.board.findUnique({
          where: { id: args.id },
          include: { lists: { include: { cards: true } } },
        });
        return board;
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createBoard: {
      type: BoardType,
      args: {
        name: { type: GraphQLString },
        background: { type: GraphQLString },
      },
      async resolve(parent, args, context: Context) {
        const { user, prisma } = context;
        if (!user) {
          throw new Error("You must be logged in to create a board");
        }
        const newBoard = await prisma.board.create({
          data: {
            name: args.name,
            background: args.background,
            belongs_to: {
              connect: { id: user.id },
            },
          },
        });
        return newBoard;
      },
    },
    createList: {
      type: ListType,
      args: {
        name: { type: GraphQLString },
        board_id: { type: GraphQLID },
      },
      async resolve(parent, args, context: Context) {
        const { user, prisma } = context;
        if (!user) {
          throw new Error("You must be logged in to create a list");
        }
        console.log(args.board_id);
        // The board must belong to the user
        const newList = await prisma.list.create({
          data: {
            name: args.name,
            board: {
              connect: { id: args.board_id, belongs_to: { id: user.id } },
            },
          },
        });
        return newList;
      },
    },
    createCard: {
      type: CardType,
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        list_id: { type: GraphQLID },
      },
      async resolve(parent, args, context: Context) {
        const { user, prisma } = context;
        if (!user) {
          throw new Error("You must be logged in to create a card");
        }
        // The list must belong to the user
        const newCard = await prisma.card.create({
          data: {
            title: args.title,
            description: args.description,
            list: {
              connect: {
                id: args.list_id,
                board: { belongs_to: { id: user.id } },
              },
            },
          },
        });
        return newCard;
      },
    },
    createLabel: {
      type: LabelType,
      args: {
        name: { type: GraphQLString },
        color: { type: GraphQLString },
      },
      resolve(parent, args, context: Context) {
        const { user, prisma } = context;
        if (!user) {
          throw new Error("You must be logged in to create a label");
        }
        // The board must belong to the user
        const newLabel = prisma.label.create({
          data: {
            name: args.name,
            color: args.color,
            board: {
              connect: { id: args.board_id, belongs_to: { id: user.id } },
            },
          },
        });
        return newLabel;
      },
    },

    moveCard: {
      type: CardType,
      args: {
        card_id: { type: GraphQLID },
        list_id: { type: GraphQLID },
      },
      async resolve(parent, args, context: Context) {
        const { user, prisma } = context;
        if (!user) {
          throw new Error("You must be logged in to move a card");
        }
        // The card must belong to the user
        const movedCard = await prisma.card.update({
          where: { id: args.card_id },
          data: {
            list: {
              connect: {
                id: args.list_id,
                board: { belongs_to: { id: user.id } },
              },
            },
          },
        });
        return movedCard;
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation,
});

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

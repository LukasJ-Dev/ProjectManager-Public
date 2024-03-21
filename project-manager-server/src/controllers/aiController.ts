import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";
import * as chatgpt from "../utils/chatgpt";
import { prisma } from "../app";

/*
RESPONSE FROM CHATGPT SUGGESTION
{
	"board": {
		"background": "#ffffff",
		"lists": [
			{
				"name": "User Stories",
				"cards": [
					{
						"title": "As a user, I want to be able to create an account"
					},
					{
						"title": "As a user, I want to be able to log in to my account"
					},
					{
						"title": "As a user, I want to be able to reset my password"
					},
					{
						"title": "As a user, I want to be able to update my profile information"
					},
					{
						"title": "As a user, I want to be able to view my account activity"
					},
					{
						"title": "As a user, I want to be able to search for other users"
					},
					{
						"title": "As a user, I want to be able to send friend requests"
					}
				]
			},
			{
				"name": "To Do",
				"cards": [
					{
						"title": "Implement user authentication"
					},
					{
						"title": "Create account creation page"
					},
					{
						"title": "Create login page"
					},
					{
						"title": "Create password reset functionality"
					},
					{
						"title": "Create profile update page"
					},
					{
						"title": "Create account activity page"
					},
					{
						"title": "Implement user search feature"
					},
					{
						"title": "Implement friend request functionality"
					}
				]
			},
			{
				"name": "In Progress",
				"cards": []
			},
			{
				"name": "Done",
				"cards": []
			}
		]
	}
}
*/
export const suggest = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.id) {
    return res.json({ error: "User not found" });
  }
  console.log(req.body.boardTitle);
  if (!req.body.boardTitle) {
    return res.json({ error: "Board not found" });
  }
  const board = await chatgpt.suggest(req.body.boardTitle);
  if (!req.body.boardId) {
    return res.json({ board });
  }
  console.log(board);
  // Create lists and cards to prisma. No need to create board because it already exists in prisma.
  // The structure is at the top of the file
  const lists = board.lists;
  console.log(lists);
  if (!lists) return res.json({ board });
  for (const list of lists) {
    const cards = list?.cards;

    console.log(cards);
    // Lists and cards must belong to the user
    const createdList = await prisma.list.create({
      data: {
        name: list.name,
        board: {
          connect: {
            id: req.body.boardId,
            belongs_to: { id: req.user?.id },
          },
        },
      },
    });
    if (cards[0]?.title) {
      for (const card of cards) {
        await prisma.card.create({
          data: {
            title: card.title,
            description: "",
            list: {
              connect: {
                id: createdList.id,
                board: { belongs_to: { id: req.user?.id } },
              },
            },
          },
        });
      }
    }
  }
};

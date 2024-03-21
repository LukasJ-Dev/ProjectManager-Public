import OpenAI from "openai";
import { config } from "../config";

const openai = new OpenAI({
  apiKey: config.OpenAiKey, // This is the default and can be omitted
});

/*
Suggest should have a kanban board name as input and return lists names and cards titles for each list
It should be in JSON format like this:
{
    "background": "#ffffff",
    "lists": [
        {
        "name": "List 1",
        "cards": [
            {
            "title": "Card 1"
            },
            {
            "title": "Card 2"
            }
        ]
        },
        {
        "name": "List 2",
        "cards": [
            {
            "title": "Card 3"
            }
        ]
        }
    ]
}
The suggestion should be a good starting point for the user to start using the app
*/

export async function suggest(boardName: string) {
  const prompt = `
  
  Generate a set of initial Kanban board configurations for a new user. 
  The board name is ${boardName}. Based on this name, create a JSON structure representing the board. 
  This JSON should include a default background color and a list of tasks organized into different lists. 
  Each list should have a unique name and contain several cards, each with its own title.
  Cards should be specific and actionable, and should not be too broad or general.
  User stories are allowed. If the project is a software project, the tasks should primarily programming tasks.
  Remember to not put cards in the "Done" or "In Progress" lists because the project has not started yet.
  Try to have 7 - 20 cards. The number of cards should be based on the size of the project. 
  The cards should be related to the project and should not be too general or unrelated to the project.
  
  The JSON structure should follow this format:
  {
    "background": "#ffffff",
    "lists": [
        {
            "name": "User Stories",
            "cards": [
              {"title": "As a user i want to be able to..."},
              
              {"title": "As a user i want to be able to..."},
            ]
          }
      {
        "name": "To Do",
        "cards": [
          {"title": "Implement authentication"},
          {"title": "Create dashboard page"}
        ]
      },
      {
        "name": "In Progress",
        "cards": [
        ]
      }
      {
        "name": "Done",
        "cards": [
        ]
      }
    ]
  }
  This format is designed to be a practical and intuitive starting point, ensuring users can easily begin managing their projects with a well-structured Kanban board.
  IMPORTANT: THE JSON MUST BE VALID AND PARSEABLE. OTHERWISE, IT WILL NOT BE USEFUL FOR USERS. JSON.PARSE SHOULD BE ABLE TO PARSE THE JSON WITHOUT ERRORS.
  THE RESPONSE SHOULD NEVER BE BLANK OR EMPTY. IF THE AI IS UNABLE TO GENERATE A RESPONSE, IT SHOULD RETURN AN ERROR MESSAGE INSTEAD IN JSON FORMAT.
  DO NOT RESPONSE WITH A STRING. THE RESPONSE MUST BE IN JSON FORMAT. THE RESPONSE SHOULD BE A VALID JSON OBJECT. DO NOT INCLUDE JSON MARKDOWN OR JSON CODE BLOCKS.
`;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 1000,
    });

    const dataText = response.choices[0].message.content;
    //Removes json``` from the beginning and end of the response
    console.log(dataText);
    if (dataText) {
      const board = JSON.parse(dataText);

      return board;
    }
    return null;
  } catch (error) {
    console.error("Error calling ChatGPT API:", error);
    return null;
  }
}

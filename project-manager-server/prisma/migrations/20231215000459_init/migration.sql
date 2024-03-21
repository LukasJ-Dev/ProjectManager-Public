/*
  Warnings:

  - The primary key for the `Card` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CardLabel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Label` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `List` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Board` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "list_id" TEXT NOT NULL,
    CONSTRAINT "Card_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "List" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Card" ("description", "id", "list_id", "title") SELECT "description", "id", "list_id", "title" FROM "Card";
DROP TABLE "Card";
ALTER TABLE "new_Card" RENAME TO "Card";
CREATE TABLE "new_CardLabel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cardId" TEXT NOT NULL,
    "labelId" TEXT NOT NULL,
    CONSTRAINT "CardLabel_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CardLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CardLabel" ("cardId", "id", "labelId") SELECT "cardId", "id", "labelId" FROM "CardLabel";
DROP TABLE "CardLabel";
ALTER TABLE "new_CardLabel" RENAME TO "CardLabel";
CREATE UNIQUE INDEX "CardLabel_cardId_labelId_key" ON "CardLabel"("cardId", "labelId");
CREATE TABLE "new_Label" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "board_id" TEXT NOT NULL,
    CONSTRAINT "Label_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "Board" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Label" ("board_id", "color", "id", "name") SELECT "board_id", "color", "id", "name" FROM "Label";
DROP TABLE "Label";
ALTER TABLE "new_Label" RENAME TO "Label";
CREATE TABLE "new_List" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "board_id" TEXT NOT NULL,
    CONSTRAINT "List_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "Board" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_List" ("board_id", "id", "name") SELECT "board_id", "id", "name" FROM "List";
DROP TABLE "List";
ALTER TABLE "new_List" RENAME TO "List";
CREATE TABLE "new_Board" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "background" TEXT NOT NULL,
    "belongs_to_id" TEXT NOT NULL,
    CONSTRAINT "Board_belongs_to_id_fkey" FOREIGN KEY ("belongs_to_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Board" ("background", "belongs_to_id", "id", "name") SELECT "background", "belongs_to_id", "id", "name" FROM "Board";
DROP TABLE "Board";
ALTER TABLE "new_Board" RENAME TO "Board";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_image" TEXT NOT NULL
);
INSERT INTO "new_User" ("email", "first_name", "id", "last_name", "password", "profile_image") SELECT "email", "first_name", "id", "last_name", "password", "profile_image" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

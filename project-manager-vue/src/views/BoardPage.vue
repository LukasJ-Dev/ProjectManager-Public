<script setup lang="ts">
import { useRoute } from "vue-router";
import {
  BOARD_QUERY,
  CREATE_LIST_MUTATION,
  CREATE_CARD_MUTATION,
  MOVE_CARD_MUTATION,
} from "../api/graphql";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { watch } from "vue";
import { useStore } from "../store";
import { Card } from "../types";

const store = useStore();

const router = useRoute();
const boardId = router.params.id;

const newList = async () => {
  const listName = prompt("List Name");
  if (listName === null) return;
  const newList = await createList({ name: listName, board_id: boardId });
  if (newList?.data.createList) {
    store.addList(newList.data.createList);
  }
  // Post to graphql mutation to create new board and add to store
};

const newCard = async (listId: string) => {
  console.log(listId);
  const cardTitle = prompt("Card Title");
  if (cardTitle === null) return;
  const newCard = await createCard({
    title: cardTitle,
    description: "",
    list_id: listId,
  });
  if (newCard?.data.createCard) {
    console.log(newCard.data.createCard);
    store.addCard({ listId, card: newCard.data.createCard });
  }
};

const startDrag = (event: DragEvent, item: Card) => {
  console.log(item);
  if (event.dataTransfer === null) return;
  event.dataTransfer.dropEffect = "move";
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("itemID", item.id);
};

const onDrop = async (event: DragEvent, listId: string) => {
  console.log("dropped");
  if (event.dataTransfer === null) return;
  const itemId = event.dataTransfer.getData("itemID");
  const card = await moveCard({ card_id: itemId, list_id: listId });
  if (card?.data.moveCard) {
    store.moveCard({ card: card.data.moveCard, listId });
  }
};

const { result } = useQuery(BOARD_QUERY, {
  id: boardId,
});

const { mutate: createList } = useMutation(CREATE_LIST_MUTATION);

const { mutate: createCard } = useMutation(CREATE_CARD_MUTATION);

const { mutate: moveCard } = useMutation(MOVE_CARD_MUTATION);

watch(result, () => {
  store.setOpenedBoard(result.value.board);
  console.log(result.value.board);
});
</script>
<template>
  <div class="w-4/5 mx-auto flex flex-col gap-4">
    <h1 class="font-medium text-2xl">{{ store.openedBoard?.name || "" }}</h1>
    <ul class="flex gap-2 flex-nowrap overflow-x-scroll select-none">
      <li
        v-for="list in store.openedBoard?.lists || []"
        :key="list.id"
        class="bg-slate-100 min-w-72 h-fit flex flex-col p-2 rounded-md"
        @drop="onDrop($event, list.id)"
        @dragenter.prevent
        @dragover.prevent
      >
        <h2 class="font-medium text-xl">{{ list.name }}</h2>

        <ul class="flex flex-col gap-2">
          <li
            v-for="card in list.cards"
            :key="card.id"
            class="bg-white p-2 rounded-md"
            draggable="true"
            @dragstart="startDrag($event, card)"
          >
            {{ card.title }}
          </li>
          <li class="p-2 cursor-pointer select-none" @click="newCard(list.id)">
            Add Card...
          </li>
        </ul>
      </li>
      <li
        class="bg-slate-100 min-w-72 h-fit flex flex-col p-2 rounded-md"
        @click="newList"
      >
        <h2 class="font-medium text-xl cursor-pointer select-none">Add List</h2>
      </li>
    </ul>
  </div>
</template>

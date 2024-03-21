<script setup lang="ts">
import { useQuery, useMutation } from "@vue/apollo-composable";
import { watch } from "vue";
import { useStore } from "../store";
import { router } from "../router";
import { CREATE_BOARD_MUTATION, MY_BOARDS_QUERY } from "../api/graphql";
import { getSuggestions } from "../api";

const store = useStore();

const { mutate: createBoard } = useMutation(CREATE_BOARD_MUTATION);

const newBoard = async () => {
  const boardName = prompt("Board Name");
  if (boardName === null) return;
  const createBoardResult = await createBoard({
    name: boardName,
    background: "test.png",
  });
  if (createBoardResult?.data) {
    console.log(createBoardResult.data.createBoard);
    store.addBoard(createBoardResult.data.createBoard);
    getSuggestions(boardName, createBoardResult.data.createBoard.id);
    // Post to graphql mutation to create new board and add to store
  }
};

const { result } = useQuery(MY_BOARDS_QUERY);

/*
mutation {
	createBoard(name: "test b", background: "test.png") {
		id
		name
	}
}
*/

watch(result, () => {
  store.setBoards(result.value.boards);
});
</script>

<template>
  <div class="w-4/5 mx-auto">
    <h2 class="font-medium text-2xl">Dashboard</h2>
    <!--Lists all boards-->
    <ul class="flex gap-2 flex-wrap">
      <li
        v-for="board in store.boards"
        :key="board.id"
        class="bg-slate-100 w-72 h-24 flex flex-col p-2 rounded-md"
        @click="() => router.push(`/board/${board.id}`)"
      >
        <h3 class="text-xl">{{ board.name }}</h3>
      </li>
      <li
        class="bg-slate-100 w-72 h-24 flex flex-col p-2 rounded-md cursor-pointer"
        @click="newBoard"
      >
        <h3 class="text-xl text-center my-auto text-gray-500 select-none">
          New board...
        </h3>
      </li>
    </ul>
  </div>
</template>

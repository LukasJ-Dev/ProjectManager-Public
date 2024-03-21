import { createApp, h, provide } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./router";
import { createPinia } from "pinia";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { baseURL } from "./api";
import { DefaultApolloClient } from "@vue/apollo-composable";

const pinia = createPinia();

function getHeaders() {
  const headers: { Authorization?: string; "Content-Type"?: string } = {};
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  headers["Content-Type"] = "application/json";
  return headers;
}

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: `${baseURL}/graphql`,
  fetch: (uri: RequestInfo, options: RequestInit) => {
    options.headers = getHeaders();
    return fetch(uri, options);
  },
});

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },

  render: () => h(App),
});

app.use(pinia).use(router).mount("#app");

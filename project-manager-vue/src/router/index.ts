import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import BoardPage from "../views/BoardPage.vue";
import * as api from "../api";

/*
Routes:
- /: dashboard
- /login: login
- /register: register
- /board/:id: board
*/

const routes = [
  { path: "/", component: Dashboard },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/board/:id", component: BoardPage },
];

const history = createWebHistory();

const router = createRouter({
  history,
  routes,
});

// If the user is not logged in, redirect to the login page. If user is logged in and tries to access the login or register page, redirect to the dashboard.
router.beforeEach(async (to, _, next) => {
  const publicPages = ["/login", "/register"];
  const pagesForGuestsOnly = ["/login", "/register"];
  const authRequired = !publicPages.includes(to.path);

  const token = localStorage.getItem("token");
  const { user } = token ? await api.getUser() : { user: undefined };

  if (authRequired && !user) {
    next("/login");
  } else if (user && pagesForGuestsOnly.includes(to.path)) {
    next("/");
  } else {
    next();
  }
});

export { router };

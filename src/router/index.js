import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/GeneralInfo.vue";
import Module from "../views/Module";
import Programme from "../views/Programme";
import CCD from "../views/ContinueCurrentDegree";
import Launch from "../views/Launch.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Launch",
    component: Launch
  },
  {
    path: "/general",
    name: "Home",
    component: Home
  },
  {
    path: "/module",
    name: "Module",
    component: Module
  },
  {
    path: "/programme",
    name: "Programme",
    component: Programme
  },
  {
    path: "/continue-current-degree",
    name: "CCD",
    component: CCD
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

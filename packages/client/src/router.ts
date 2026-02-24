import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import CaptureView from "@/views/CaptureView.vue";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: HomeView },
    { path: "/capture", component: CaptureView },
  ],
});

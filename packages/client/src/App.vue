<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";
import { computed } from "vue";

import SettingsPopover from "@/components/SettingsPopover.vue";
import { provideTheme, provideTimestampSettings, provideSession } from "@/composables";

provideTheme("light", "vite-ui-theme");
provideTimestampSettings();
provideSession();

const route = useRoute();
const isHome = computed(() => route.path === "/");
const isCapture = computed(() => route.path === "/capture");
</script>

<template>
  <div class="flex items-center justify-between p-2">
    <div class="flex gap-2">
      <RouterLink
        to="/"
        :class="isHome ? 'font-bold' : ''"
        data-testid="nav-home-link"
      >
        Home
      </RouterLink>
      <RouterLink
        to="/capture"
        :class="isCapture ? 'font-bold' : ''"
        data-testid="nav-capture-link"
      >
        Capture
      </RouterLink>
    </div>
    <SettingsPopover />
  </div>
  <hr>
  <RouterView />
</template>

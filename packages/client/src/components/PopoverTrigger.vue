<script setup lang="ts">
import { PopoverTrigger } from "radix-vue";
</script>

<template>
  <PopoverTrigger as-child>
    <slot />
  </PopoverTrigger>
</template>

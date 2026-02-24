<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { ref } from "vue";
import { EllipsisVertical, Pencil } from "lucide-vue-next";
import Button from "@/components/Button.vue";
import Popover from "@/components/Popover.vue";
import PopoverTrigger from "@/components/PopoverTrigger.vue";
import PopoverContent from "@/components/PopoverContent.vue";

interface TimerEntry {
  text: string;
  timestamp: string;
  mode?: "submit" | "typing-start";
}

defineProps<{
  row: Row<TimerEntry>;
}>();

const emit = defineEmits<{
  edit: [];
  delete: [];
}>();

const open = ref(false);
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger>
      <Button
        variant="ghost"
        size="icon-xs"
        data-testid="entry-actions-trigger"
      >
        <EllipsisVertical class="size-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent
      align="end"
      class="w-40 p-1"
    >
      <Button
        variant="ghost"
        size="sm"
        class="w-full justify-start"
        data-testid="edit-entry-button"
        @click="open = false; emit('edit')"
      >
        <Pencil class="mr-2 size-4" />
        Edit Entry
      </Button>
      <Button
        variant="ghost"
        size="sm"
        class="w-full justify-start text-destructive"
        data-testid="delete-entry-button"
        @click="open = false; emit('delete')"
      >
        Delete Entry
      </Button>
    </PopoverContent>
  </Popover>
</template>

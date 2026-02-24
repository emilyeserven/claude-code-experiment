<script setup lang="ts">
import { ref } from "vue";
import { ClipboardCopy, EllipsisVertical, Trash2 } from "lucide-vue-next";
import Button from "@/components/Button.vue";
import Popover from "@/components/Popover.vue";
import PopoverTrigger from "@/components/PopoverTrigger.vue";
import PopoverContent from "@/components/PopoverContent.vue";
import AlertDialog from "@/components/dialogs/AlertDialog.vue";
import AlertDialogHeader from "@/components/dialogs/AlertDialogHeader.vue";
import AlertDialogFooter from "@/components/dialogs/AlertDialogFooter.vue";
import AlertDialogTitle from "@/components/dialogs/AlertDialogTitle.vue";
import AlertDialogDescription from "@/components/dialogs/AlertDialogDescription.vue";
import AlertDialogAction from "@/components/dialogs/AlertDialogAction.vue";
import AlertDialogCancel from "@/components/dialogs/AlertDialogCancel.vue";
import MarkdownExportDialog from "@/components/dialogs/MarkdownExportDialog.vue";

interface TimerEntry {
  text: string;
  timestamp: string;
  mode?: "submit" | "typing-start";
}

const props = defineProps<{
  sessionName: string;
  entries: TimerEntry[];
}>();

const emit = defineEmits<{
  deleteSession: [];
}>();

const popoverOpen = ref(false);
const showMarkdownDialog = ref(false);
const showDeleteSessionDialog = ref(false);

function handleDeleteSession() {
  emit("deleteSession");
  showDeleteSessionDialog.value = false;
}
</script>

<template>
  <Popover v-model:open="popoverOpen">
    <PopoverTrigger>
      <Button
        variant="ghost"
        size="icon-xs"
        data-testid="session-settings-trigger"
      >
        <EllipsisVertical class="size-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent
      align="end"
      class="w-48 p-1"
    >
      <Button
        variant="ghost"
        size="sm"
        class="w-full justify-start"
        :disabled="props.entries.length === 0"
        data-testid="export-markdown-button"
        @click="popoverOpen = false; showMarkdownDialog = true"
      >
        <ClipboardCopy class="mr-2 size-4" />
        Export as Markdown
      </Button>
      <Button
        variant="ghost"
        size="sm"
        class="w-full justify-start text-destructive"
        data-testid="delete-session-button"
        @click="popoverOpen = false; showDeleteSessionDialog = true"
      >
        <Trash2 class="mr-2 size-4" />
        Delete Session
      </Button>
    </PopoverContent>
  </Popover>

  <MarkdownExportDialog
    :open="showMarkdownDialog"
    :entries="props.entries"
    @update:open="showMarkdownDialog = $event"
  />

  <AlertDialog
    :open="showDeleteSessionDialog"
    @update:open="showDeleteSessionDialog = $event"
  >
    <AlertDialogHeader>
      <AlertDialogTitle data-testid="delete-session-title">
        Delete Session?
      </AlertDialogTitle>
      <AlertDialogDescription data-testid="delete-session-description">
        Are you sure you want to delete "{{ props.sessionName }}"? All entries in this session will be permanently removed. This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel data-testid="cancel-delete-session">
        Cancel
      </AlertDialogCancel>
      <AlertDialogAction
        variant="destructive"
        data-testid="confirm-delete-session"
        @click="handleDeleteSession"
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialog>
</template>

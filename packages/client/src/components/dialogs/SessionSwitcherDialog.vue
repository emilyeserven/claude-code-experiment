<script setup lang="ts">
import type { Session } from "@/composables/useSession";
import { ref } from "vue";
import { Plus } from "lucide-vue-next";
import Button from "@/components/Button.vue";
import Input from "@/components/Input.vue";
import Dialog from "@/components/dialogs/Dialog.vue";
import DialogHeader from "@/components/dialogs/DialogHeader.vue";
import DialogFooter from "@/components/dialogs/DialogFooter.vue";
import DialogTitle from "@/components/dialogs/DialogTitle.vue";
import DialogDescription from "@/components/dialogs/DialogDescription.vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  open: boolean;
  sessions: Session[];
  activeSessionId: string;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  switchSession: [id: string];
  createSession: [name: string];
}>();

const isCreating = ref(false);
const newSessionName = ref("");

function handleSelect(id: string) {
  emit("switchSession", id);
  emit("update:open", false);
}

function handleCreate() {
  const trimmed = newSessionName.value.trim();
  if (trimmed) {
    emit("createSession", trimmed);
    newSessionName.value = "";
    isCreating.value = false;
    emit("update:open", false);
  }
}

function handleCreateKeyDown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    handleCreate();
  } else if (e.key === "Escape") {
    isCreating.value = false;
    newSessionName.value = "";
  }
}
</script>

<template>
  <Dialog
    :open="props.open"
    @update:open="emit('update:open', $event)"
  >
    <DialogHeader>
      <DialogTitle data-testid="switch-session-title">
        Switch Session
      </DialogTitle>
      <DialogDescription data-testid="switch-session-description">
        Select a session or create a new one.
      </DialogDescription>
    </DialogHeader>
    <div
      class="max-h-60 space-y-1 overflow-y-auto"
      data-testid="session-list"
    >
      <button
        v-for="session in props.sessions"
        :key="session.id"
        type="button"
        :class="cn(
          'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent',
          session.id === props.activeSessionId && 'bg-accent font-medium',
        )"
        data-testid="session-list-item"
        :data-session-id="session.id"
        @click="handleSelect(session.id)"
      >
        <span>{{ session.name }}</span>
        <span class="text-xs text-muted-foreground">
          {{ session.entries.length }} {{ session.entries.length === 1 ? "entry" : "entries" }}
        </span>
      </button>
    </div>
    <DialogFooter>
      <div
        v-if="isCreating"
        class="flex w-full gap-2"
      >
        <Input
          v-model="newSessionName"
          placeholder="Session name..."
          autofocus
          data-testid="new-session-name-input"
          @keydown="handleCreateKeyDown"
        />
        <Button
          :disabled="!newSessionName.trim()"
          data-testid="confirm-create-session"
          @click="handleCreate"
        >
          Create
        </Button>
        <Button
          variant="outline"
          data-testid="cancel-create-session"
          @click="isCreating = false; newSessionName = ''"
        >
          Cancel
        </Button>
      </div>
      <Button
        v-else
        variant="outline"
        class="w-full"
        data-testid="new-session-button"
        @click="isCreating = true"
      >
        <Plus class="size-4" />
        New Session
      </Button>
    </DialogFooter>
  </Dialog>
</template>

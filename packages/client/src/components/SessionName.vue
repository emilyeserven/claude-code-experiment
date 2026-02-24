<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { Check, Pencil, X } from "lucide-vue-next";
import Button from "@/components/Button.vue";

const props = defineProps<{
  name: string;
}>();

const emit = defineEmits<{
  rename: [name: string];
}>();

const isEditing = ref(false);
const editValue = ref(props.name);
const inputRef = ref<HTMLInputElement | null>(null);

watch(() => props.name, (newName) => {
  editValue.value = newName;
});

watch(isEditing, async (editing) => {
  if (editing) {
    await nextTick();
    inputRef.value?.focus();
    inputRef.value?.select();
  }
});

function handleSave() {
  const trimmed = editValue.value.trim();
  if (trimmed && trimmed !== props.name) {
    emit("rename", trimmed);
  } else {
    editValue.value = props.name;
  }
  isEditing.value = false;
}

function handleCancel() {
  editValue.value = props.name;
  isEditing.value = false;
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    handleSave();
  } else if (e.key === "Escape") {
    handleCancel();
  }
}
</script>

<template>
  <div
    v-if="isEditing"
    class="flex items-center gap-1"
    data-testid="session-name-editor"
  >
    <input
      ref="inputRef"
      :value="editValue"
      class="h-8 w-48 rounded-md border border-input bg-transparent px-3 py-1 text-center text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      data-testid="session-name-input"
      @input="editValue = ($event.target as HTMLInputElement).value"
      @keydown="handleKeyDown"
    >
    <Button
      variant="ghost"
      size="icon-xs"
      data-testid="session-name-save"
      @click="handleSave"
    >
      <Check class="size-3.5" />
    </Button>
    <Button
      variant="ghost"
      size="icon-xs"
      data-testid="session-name-cancel"
      @click="handleCancel"
    >
      <X class="size-3.5" />
    </Button>
  </div>
  <div
    v-else
    class="flex items-center gap-1"
    data-testid="session-name-display"
  >
    <span
      class="text-sm font-medium text-muted-foreground"
      data-testid="session-name-text"
    >
      {{ name }}
    </span>
    <Button
      variant="ghost"
      size="icon-xs"
      data-testid="session-name-edit-button"
      @click="isEditing = true"
    >
      <Pencil class="size-3" />
    </Button>
  </div>
</template>

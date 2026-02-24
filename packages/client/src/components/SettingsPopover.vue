<script setup lang="ts">
import { ref, computed } from "vue";
import { ArrowLeftRight, Moon, Settings, Sun } from "lucide-vue-next";
import { SwitchRoot, SwitchThumb } from "radix-vue";
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
import AlertDialogTrigger from "@/components/dialogs/AlertDialogTrigger.vue";
import SessionSwitcherDialog from "@/components/dialogs/SessionSwitcherDialog.vue";
import { useSession, useTheme, useTimestampSettings } from "@/composables";
import { cn } from "@/lib/utils";

const { theme, setTheme } = useTheme();
const { sessions, activeSession, switchSession, createSession } = useSession();
const { timestampMode, setTimestampMode } = useTimestampSettings();
const sessionDialogOpen = ref(false);

const isDark = computed(() => theme.value === "dark");
const isTypingStart = computed(() => timestampMode.value === "typing-start");
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <Button
        variant="ghost"
        size="icon"
        data-testid="settings-trigger"
      >
        <Settings class="size-5" />
        <span class="sr-only">Settings</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent
      align="end"
      class="w-64"
    >
      <div class="space-y-4">
        <h4
          class="text-sm leading-none font-medium"
          data-testid="settings-heading"
        >
          Settings
        </h4>
        <div class="flex items-center justify-between">
          <span
            class="text-sm"
            data-testid="dark-mode-label"
          >Dark Mode</span>
          <SwitchRoot
            :checked="isDark"
            data-testid="dark-mode-toggle"
            :class="cn(
              'relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
            )"
            @update:checked="setTheme($event ? 'dark' : 'light')"
          >
            <Sun class="absolute left-1 size-3.5 text-amber-500" />
            <Moon class="absolute right-1 size-3.5 text-slate-300" />
            <SwitchThumb
              :class="cn(
                'pointer-events-none z-10 flex size-5 items-center justify-center rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-7.5 data-[state=unchecked]:translate-x-0.5',
              )"
            >
              <Moon
                v-if="isDark"
                class="size-3 text-primary"
              />
              <Sun
                v-else
                class="size-3 text-amber-500"
              />
            </SwitchThumb>
          </SwitchRoot>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm">Timestamp on Typing Start</span>
          <SwitchRoot
            :checked="isTypingStart"
            data-testid="timestamp-mode-toggle"
            :class="cn(
              'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
            )"
            @update:checked="setTimestampMode($event ? 'typing-start' : 'submit')"
          >
            <SwitchThumb
              :class="cn(
                'pointer-events-none block size-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
              )"
            />
          </SwitchRoot>
        </div>
        <div class="border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            class="w-full"
            data-testid="switch-session-trigger"
            @click="sessionDialogOpen = true"
          >
            <ArrowLeftRight class="size-4" />
            Switch Session
          </Button>
        </div>
        <div class="border-t pt-4">
          <AlertDialog>
            <template #trigger>
              <AlertDialogTrigger>
                <Button
                  variant="destructive"
                  size="sm"
                  class="w-full"
                  data-testid="reset-localstorage-trigger"
                >
                  Reset Local Storage
                </Button>
              </AlertDialogTrigger>
            </template>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Local Storage?</AlertDialogTitle>
              <AlertDialogDescription>
                This will clear all locally saved data including theme preferences and timer entries. The page will reload to apply defaults.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="reset-localstorage-cancel">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                data-testid="reset-localstorage-confirm"
                @click="localStorage.clear(); window.location.reload()"
              >
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialog>
        </div>
      </div>
    </PopoverContent>
  </Popover>
  <SessionSwitcherDialog
    :open="sessionDialogOpen"
    :sessions="sessions"
    :active-session-id="activeSession.id"
    @update:open="sessionDialogOpen = $event"
    @switch-session="switchSession"
    @create-session="createSession"
  />
</template>

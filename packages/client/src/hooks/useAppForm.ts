import { createFormHook } from "@tanstack/react-form";

import { TextField } from "@/components/TextField";
import { fieldContext, formContext } from "@/hooks/useFormContext";

export const {
  useAppForm, withForm,
} = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {},
  fieldContext,
  formContext,
});

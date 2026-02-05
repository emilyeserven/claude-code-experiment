import { createFormHook } from "@tanstack/react-form";

import { FormInput } from "@/components/FormInput";
import { fieldContext, formContext } from "@/hooks/useFormContext";

export const {
  useAppForm, withForm,
} = createFormHook({
  fieldComponents: {
    FormInput,
  },
  formComponents: {},
  fieldContext,
  formContext,
});

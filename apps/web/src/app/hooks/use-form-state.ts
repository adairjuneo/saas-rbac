import { type FormEvent, useState, useTransition } from 'react';

export type FormState = {
  success: boolean;
  message: string | null;
  errors: Record<string, string[]> | null;
};

const useFormState = (
  action: (data: FormData) => Promise<FormState>,
  onSuccess?: () => Promise<void> | void,
  initialState?: FormState
) => {
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState(
    initialState ?? {
      success: false,
      message: null,
      errors: null,
    }
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const dataForm = new FormData(form);

    startTransition(async () => {
      const result = await action(dataForm);

      if (result.success === true && onSuccess) {
        await onSuccess();
      }

      setFormState(result);
    });
  };

  return [formState, handleSubmit, isPending] as const;
};

export { useFormState };

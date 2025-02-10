import { type FormEvent, useState, useTransition } from 'react';

export type FormState = {
  success: boolean;
  message: string | null;
  errors: Record<string, string[]> | null;
};

export type OnSucessResponse = {
  message: string | null;
};

export type OnErrorResponse = {
  errors: FormState['errors'];
  message: string | null;
};

const useFormState = <TAData = FormData>(
  action: (data: TAData) => Promise<FormState>,
  onSuccess?: (response?: OnSucessResponse) => Promise<void> | void,
  onError?: (reponse?: OnErrorResponse) => Promise<void> | void,
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
    const dataForm = new FormData(form) as TAData;

    startTransition(async () => {
      const result = await action(dataForm);

      if (result.success === true && onSuccess) {
        await onSuccess({ message: result.message });
      }

      if (result.success === false && onError) {
        await onError({ message: result.message, errors: result.errors });
      }

      setFormState(result);
    });
  };

  return [formState, handleSubmit, isPending] as const;
};

export { useFormState };

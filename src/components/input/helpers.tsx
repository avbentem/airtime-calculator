import React, {Dispatch, SetStateAction} from 'react';

/**
 * Get an object that can be spread for use in Bootstrap forms, like
 * `<FormControl {...withFormControl(state)}/>`.
 */
export function withFormControl<T>(state: {value: T; setValue: Dispatch<SetStateAction<T>>}) {
  // See https://github.com/react-bootstrap/react-bootstrap/issues/2781
  function onChange(event: React.FormEvent<any>) {
    const target = event.currentTarget;
    state.setValue(typeof state.value === 'number' ? (+target.value as any) : target.value);
  }

  // FormControl expects a string for value
  return {value: '' + state.value, onChange};
}

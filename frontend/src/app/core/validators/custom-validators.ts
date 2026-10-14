import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noDigitsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const hasDigits = /\d/.test(control.value);
    return hasDigits ? { hasDigits: true } : null;
  };
}

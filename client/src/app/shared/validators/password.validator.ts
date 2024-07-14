import { AbstractControl, ValidationErrors } from '@angular/forms';

export function PasswordValidator(
  control: AbstractControl
): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password?.pristine || confirmPassword?.pristine) {
    return null;
  }

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { mismatch: true }
    : null;
}
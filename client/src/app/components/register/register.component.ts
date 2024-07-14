import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControlOptions,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { PasswordValidator } from '../../shared/validators/password.validator';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { RegisterService } from '../../services/register.service';
import { VerificationDialogComponent } from '../verification-dialog/verification-dialog.component';
import { passwordPattern, usernamePattern } from '../../utils/constants';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';

export interface Register {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface DialogData {
  verificationCode: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  hide = true;
  returnUrl: Params | null = null;

  registerationForm!: FormGroup;
  verificationCode: string = '';

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private _snackBar: MatSnackBar,
    private verifyDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.registerationForm = this.fb.group(
      {
        username: [
          '',
          [
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.required,
            Validators.pattern(usernamePattern),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, Validators.pattern(passwordPattern)],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: PasswordValidator } satisfies FormControlOptions
    );
  }

  private openSnackbar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 5000 });
  }

  register() {
    if (this.registerationForm.valid) {
      this.registerationForm.value.confirmPassword = undefined;
      this.registerService.register(this.registerationForm.value).subscribe({
        next: ({ msg }) => {
          this.openSnackbar(msg, 'Dismiss');

          // Open the verification code
          const asd = this.verifyDialog.open(VerificationDialogComponent, {
            width: '400px',
          });
        },
        error: ({ error }) => this._snackBar.open(error.message, 'Dismiss'),
      });
    }
  }

  toggleVisibility(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  getField(fieldName: HTMLInputElement) {
    return this.registerationForm.get(
      fieldName.getAttribute('formcontrolname')!
    );
  }
}

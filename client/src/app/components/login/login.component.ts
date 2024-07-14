import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormsModule,
  FormBuilder,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
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
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm!: FormGroup;
  returnUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  private openSnackbar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 5000 });
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        error: ({ error }) => this.openSnackbar(error.message, 'Dismiss'),
        next: (res) => {
          if (this.authService.isAdmin) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/store']);
          }
        },
      });
    }
  }

  toggleVisibility(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  getField(fieldName: HTMLInputElement) {
    return this.loginForm.get(fieldName.getAttribute('formcontrolname')!);
  }
}

export interface Login {
  email: string;
  password: string;
}

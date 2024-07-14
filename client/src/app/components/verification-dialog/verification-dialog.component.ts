import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { RegisterService } from '../../services/register.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-verification-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    FormsModule,
    MatProgressSpinner,
  ],
  templateUrl: './verification-dialog.component.html',
  styleUrl: './verification-dialog.component.css',
})
export class VerificationDialogComponent {
  error: string = '';
  verificationCode: string = '';
  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<VerificationDialogComponent>,
    private verificationService: RegisterService,
  ) {}

  isValidCode() {
    return this.verificationCode.length === 6;
  }

  verify() {
    this.isLoading = true;

    setTimeout(() => {
      this.verificationService.verify(this.verificationCode).subscribe({
        next: () => {
          this.dialogRef.close();
          alert('Verification successful');
        },
        error: ({ error }) => {
          this.error = error.message;
          this.isLoading = false;
        },
      });
    }, 5000);
  }
}

import { Component, OnInit } from '@angular/core';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormControlOptions,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PasswordValidator } from '../../shared/validators/password.validator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileImageComponent } from '../profile-image/profile-image.component';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    ProfileImageComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  hide = true;
  profileForm!: FormGroup;
  profileErrorMsg: string = '';
  avatar: string = '';
  cloudinaryId: string = '';
  selectedProfileImage: File | null = null;

  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
      },
      { validators: PasswordValidator } satisfies FormControlOptions
    );

    this.loadData();
  }

  private openSnackbar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 5000 });
  }

  loadData() {
    this.profileService.getProfileInfo().subscribe({
      next: ({ user }) => {
        const profileInfo = {
          username: user.username,
          email: user.email,
          password: '',
        };
        this.profileForm.setValue(profileInfo);
        this.avatar = user.avatar;
        this.cloudinaryId = user.cloudinaryId;
      },
      error: ({ error }) => {
        this.openSnackbar(error.message, 'Dismiss');
      },
    });
  }

  updateProfileInfo() {
    if (this.profileForm.valid) {
      this.profileService.updateProfileInfo(this.profileForm.value).subscribe({
        next: ({ msg, user }) => {

          console.log(user)
          const profileInfo = {
            username: user.username,
            email: user.email,
            password: '',
          };

          this.profileForm.setValue(profileInfo);

          this.openSnackbar(msg, 'Dismiss');
        },
        error: ({ error }) => {
          this.openSnackbar(error.message, 'Dismiss');
        },
      });
    }
  }

  selectedFile(event: File | null) {
    if (event) {
      this.selectedProfileImage = event;
    }
  }

  uploadProfileImage() {
    if (this.selectedProfileImage) {
      this.profileService
        .uploadProfileImage(this.selectedProfileImage)
        .subscribe({
          next: (res: any) => {
            if (res.body) {
              this.avatar = res.body.user.avatar;
              this.cloudinaryId = res.body.user.cloudinaryId;

              this.openSnackbar('Profile Image Updated', 'Dismiss');
            }
          },
          error: ({ error }) => {
            this.openSnackbar(error.message, 'Dismiss');
          },
        });
    }
  }

  deleteProfileImage() {
    this.profileService.deleteProfileImage().subscribe({
      next: () => {
        this.avatar = '';
        this.cloudinaryId = '';
        this.openSnackbar('Profile Image Deleted', 'Dismiss');
      },
      error: (err) => {
        console.log('Image delete error', err);
        this.openSnackbar('Error deleting profile image', 'Dismiss');
      },
    });
  }

  toggleVisibility(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  getField(fieldName: HTMLInputElement) {
    return this.profileForm.get(fieldName.getAttribute('formcontrolname')!);
  }
}

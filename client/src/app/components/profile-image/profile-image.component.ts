import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-profile-image',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatInputModule],
  templateUrl: './profile-image.component.html',
  styleUrl: './profile-image.component.css',
})
export class ProfileImageComponent {
  @Input() cloudinaryId: string = '';
  @Input() placeholder: string = 'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg';
  @Input() avatar: string = '';
  @Output() fileSelected = new EventEmitter<File | null>();
  @Output() uploadClicked = new EventEmitter<void>();
  @Output() deleteClicked = new EventEmitter<void>();

  preview = '';
  selectedProfile: File | null = null;
  progress = 0;

  onSelectImage(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (ev: ProgressEvent<FileReader>) => {
        this.preview = ev.target?.result as string;
      };

      this.selectedProfile = event.target.files[0];
      this.fileSelected.emit(this.selectedProfile);
    }
  }

  upload() {
    if (this.selectedProfile) {
      this.uploadClicked.emit();
    }
  }

  deleteProfile() {
    this.deleteClicked.emit();
  }
}

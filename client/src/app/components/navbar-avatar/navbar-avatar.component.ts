import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar-avatar',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './navbar-avatar.component.html',
  styleUrl: './navbar-avatar.component.css',
})
export class NavbarAvatarComponent {
  placeholder: string = '../../../assets/profile-placeholder.jpg';

  @Input('avatar') url: string = '';
}

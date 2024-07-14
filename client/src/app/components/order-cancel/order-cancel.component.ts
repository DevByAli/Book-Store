import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-cancel',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './order-cancel.component.html',
  styleUrl: './order-cancel.component.css',
})
export class OrderCancelComponent {
  constructor(private router: Router) {}

  onBackToStore() {
    this.router.navigate(['/store']);
  }
}

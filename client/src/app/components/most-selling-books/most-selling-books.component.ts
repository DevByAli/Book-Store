import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MostSellingBook } from '../../services/stats.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-most-selling-books',
  standalone: true,
  imports: [MatCardModule, MatDivider, MatProgressSpinnerModule],
  templateUrl: './most-selling-books.component.html',
  styleUrl: './most-selling-books.component.css',
})
export class MostSellingBooksComponent {
  @Input('isLoading') isLoading: boolean = false;
  @Input('mostSellingBooks') mostSellingBooks: MostSellingBook[] = [];
}

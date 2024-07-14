import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MostSellingCategory } from '../../services/stats.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-most-selling-category',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, MatProgressSpinnerModule],
  templateUrl: './most-selling-category.component.html',
  styleUrl: './most-selling-category.component.css',
})
export class MostSellingCategoryComponent {
  @Input('isLoading') isLoading: boolean = false;
  @Input('mostSellingCategories') mostSellingCategories: MostSellingCategory[] =
    [];
}

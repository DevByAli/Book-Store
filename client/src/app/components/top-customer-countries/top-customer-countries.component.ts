import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { TopCountry } from '../../services/stats.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-top-customer-countries',
  standalone: true,
  imports: [MatDividerModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './top-customer-countries.component.html',
  styleUrl: './top-customer-countries.component.css',
})
export class TopCustomerCountriesComponent {
  @Input('isLoading') isLoading: boolean = false;
  @Input('topCustomerCountries') topCustomerCountries: TopCountry[] = [];
}

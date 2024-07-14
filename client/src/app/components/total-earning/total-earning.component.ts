import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-total-earning',
  standalone: true,
  imports: [
    MatCardModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    CurrencyPipe,
    MatProgressSpinnerModule,
  ],
  templateUrl: './total-earning.component.html',
  styleUrl: './total-earning.component.css',
})
export class TotalEarningComponent {
  @Input('isLoading') isLoading: boolean = false;
  @Input() totalEarning: number = 0;
  @Input() selectedEarningFilter: string = '';
  @Output() selectedFilter = new EventEmitter<string>();

  earningFilter: string[] = ['week', 'month', 'year'];

  onSelectingEarningFilter(filter: string) {
    this.selectedFilter.emit(filter);
  }
}

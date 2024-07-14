import { KeyValuePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

export interface Filters {
  [key: string]: string;
}

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, MatIconModule, KeyValuePipe],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent {
  @Output() filter = new EventEmitter<string>();
  @Input('selectedFilter') selectedFilter: string = '';
  @Input('filters') filters: Filters = {};

  onFilterSelect(filter: string) {
    this.filter.emit(filter);
  }
}

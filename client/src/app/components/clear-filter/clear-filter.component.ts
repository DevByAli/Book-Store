import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-clear-filter',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './clear-filter.component.html',
  styleUrl: './clear-filter.component.css',
})
export class ClearFilterComponent {
  @Output('clearFilter') clearFilter = new EventEmitter();

  onClearFilter() {
    this.clearFilter.emit();
  }
}

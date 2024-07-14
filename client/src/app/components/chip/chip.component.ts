import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface ColorPalette {
  [key: string]: {
    [key: string]: string;
  };
}

interface ColorClasses {
  [key: string]: string;
}

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.css',
})
export class ChipComponent {
  @Input('text') text: string = 'sample';
  @Input('color') color: string = 'success';

  private colorPalette: ColorPalette = {
    delivered: { 'background-color': 'rgb(230, 255, 230)' },
    pending: { 'background-color': 'rgb(255, 253, 230)' },
    processing: { 'background-color': 'rgb(230, 236, 255)' },
    shipped: { 'background-color': 'rgb(230, 252, 255)' },
    cancelled: { 'background-color': 'rgb(255, 230, 230)' },
  };

  private colorClasses: ColorClasses = {
    success: 'text-success border-success',
    pending: 'text-warning border-warning',
    processing: 'text-primary border-primary',
    shipped: 'text-info border-info',
    cancelled: 'text-danger border-danger',
  };

  getBg() {
    return this.colorPalette[this.color];
  }

  getClass() {
    return this.colorClasses[this.color];
  }
}

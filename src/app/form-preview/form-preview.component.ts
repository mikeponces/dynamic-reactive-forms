import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-preview',
  imports: [CommonModule],
  templateUrl: './form-preview.component.html',
  styleUrl: './form-preview.component.css'
})
export class FormPreviewComponent {
  @Input() formData: any = null;
}

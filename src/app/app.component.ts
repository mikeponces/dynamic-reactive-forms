import { Component } from '@angular/core';
import { FormPreviewComponent } from './form-preview/form-preview.component';
import { ProjectFormComponent } from './project-form/project-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormPreviewComponent, ProjectFormComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  formData: any = null;
  
  onFormSubmit(data: any) {
    this.formData = data;
  }
}

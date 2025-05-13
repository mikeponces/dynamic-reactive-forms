import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent {
  @Output() formSubmit = new EventEmitter<any>();
  projectForm!: FormGroup;

  // Project priority options
  priorities = ['Low', 'Medium', 'High', 'Critical'];

  constructor(private fb: FormBuilder) { }
  ngOnInit(): void {
    this.initForm();
  }
  // Initialize the form with FormBuilder
  initForm(): void {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.maxLength(500)],
      priority: ['Medium', Validators.required],
      deadline: ['', Validators.required],
      hasBudgetConstraint: [false],
      budget: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
      teamMembers: this.fb.array([]),
      tasks: this.fb.array([]),
    });

    // Watch for changes to conditionally enable/disable budget field
    this.projectForm.get('hasBudgetConstraint')?.valueChanges.subscribe(hasBudget => {
      const budgetControl = this.projectForm.get('budget');
      if (hasBudget) {
        budgetControl?.enable();
      } else {
        budgetControl?.disable();
        budgetControl?.setValue(0);
      }
    });

    // Add one team member and task by default
    this.addTeamMember();
    this.addTask();
  }

  // Getters for form controls to use in template
  get projectName() { return this.projectForm.get('projectName'); }
  get description() { return this.projectForm.get('description'); }
  get priority() { return this.projectForm.get('priority'); }
  get deadline() { return this.projectForm.get('deadline'); }
  get budget() { return this.projectForm.get('budget'); }

  // Getter for team members FormArray
  get teamMembers(): FormArray {
    return this.projectForm.get('teamMembers') as FormArray;
  }
  // Create a new team member FormGroup
  createTeamMember(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }
  // Add team member to FormArray
  addTeamMember(): void {
    this.teamMembers.push(this.createTeamMember());
  }

  // Remove team member from FormArray
  removeTeamMember(index: number): void {
    this.teamMembers.removeAt(index);
  }
  // Getter for tasks FormArray
  get tasks(): FormArray {
    return this.projectForm.get('tasks') as FormArray;
  }
  // Create a new task FormGroup with nested subtasks FormArray
  createTask(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      assignedTo: ['', Validators.required],
      estimatedHours: [1, [Validators.required, Validators.min(1)]],
      subtasks: this.fb.array([])
    });
  }

  // Add task to FormArray
  addTask(): void {
    this.tasks.push(this.createTask());
  }
  // Remove task from FormArray
  removeTask(index: number): void {
    this.tasks.removeAt(index);
  }
  // Get subtasks FormArray for a specific task
  getSubtasks(taskIndex: number): FormArray {
    return (this.tasks.at(taskIndex) as FormGroup).get('subtasks') as FormArray;
  }
  // Create a new subtask FormGroup
  createSubtask(): FormGroup {
    return this.fb.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      isComplete: [false]
    });
  }
  // Add subtask to a specific task
  addSubtask(taskIndex: number): void {
    this.getSubtasks(taskIndex).push(this.createSubtask());
  }
  // Remove subtask from a specific task
  removeSubtask(taskIndex: number, subtaskIndex: number): void {
    this.getSubtasks(taskIndex).removeAt(subtaskIndex);
  }

  // Submit form
  onSubmit(): void {
    if (this.projectForm.valid) {
      this.formSubmit.emit(this.projectForm.value);
    } else {
      this.markFormGroupTouched(this.projectForm);
    }
  }
  // Mark all controls as touched to trigger validation
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        (control as FormArray).controls.forEach(c => {
          if (c instanceof FormGroup) {
            this.markFormGroupTouched(c);
          }
        });
      }
    });
  }

  getFormValidationErrors(): string[] {
    const errors: string[] = [];
    Object.keys(this.projectForm.controls).forEach(key => {
      const control = this.projectForm.get(key);
      if (control && control.errors) {
        if (control.errors['required']) errors.push(`${key} is required`);
        if (control.errors['minlength']) errors.push(`${key} is too short`);
        // Add more validation rules as needed
      }
    });
    return errors;
  }
}

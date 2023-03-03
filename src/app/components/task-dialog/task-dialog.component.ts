import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css']
})
export class TaskDialogComponent implements OnInit, OnDestroy {
  title = '';
  description = '';
  taskId = '';

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    private taskService: TaskService,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, description: string, taskId: string }
  ) { }

  ngOnInit() {
    this.title = this.data.title || '';
    this.description = this.data.description || '';
    this.taskId = this.data.taskId || '';
  }

  onSave(): void {
    this.dialogRef.close({ title: this.title, description: this.description, taskId: this.taskId });
  }

  onCancel() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.taskService.editTaskEnd(this.taskId || '');
  }
}

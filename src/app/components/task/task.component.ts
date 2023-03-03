import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent {
  @Input() task!: Task;
  @Input() editing =false;
  @Output() delete = new EventEmitter<Task>();
  @Output() edit = new EventEmitter<Task>();
  @Output() complete = new EventEmitter<Task>();

  onDelete() {
    this.delete.emit(this.task);
  }

  onEdit() {
    this.edit.emit(this.task);
  }

  onComplete() {
    this.complete.emit(this.task);
  }
}

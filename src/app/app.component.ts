import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TaskService } from './services/task.service';
import { Task } from './models/task.model';
import { TaskDialogComponent } from './components/task-dialog/task-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  tasks: Task[] = [];
  taskEditingIds: string[] = [];
  taskEditingSubscription: Subscription;
  taskLoadingSubscription: Subscription;
  searchTerm: string = '';

  constructor(private taskService: TaskService, private dialog: MatDialog) {
    this.taskEditingSubscription = new Subscription();
    this.taskLoadingSubscription = new Subscription();
  }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });

    this.taskEditingSubscription = this.taskService.taskEditingObservable().subscribe((taskIds) => {
      this.taskEditingIds = taskIds;
    });

    this.taskLoadingSubscription = this.taskService.tasksLoadObservable().subscribe((load) => {
      if (load) {
        this.taskService.getTasks().subscribe((tasks) => {
          this.tasks = tasks;
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.taskEditingSubscription.unsubscribe();
    this.taskLoadingSubscription.unsubscribe();
  }

  onAddTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '300px',
      data: { title: '', description: '', taskId: '', isEdit: false }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskService.addTask({
          title: result.title, description: result.description,
          completed: false, editing: false
        }).subscribe((task) => {
          this.tasks.push(task);
          this.taskService.loadTasksList();
        });
      }
    });
  }

  onDeleteTask(task: Task): void {
    this.taskService.deleteTask(task).subscribe(() => {
      this.tasks = this.tasks.filter((t) => t._id !== task._id);
      this.taskService.loadTasksList();
    });
  }

  onCompleteTask(task: Task): void {
    if (this.taskEditingIds.includes(task._id || '')) {
      return;
    }

    this.taskService.editTask(task._id || '');
    task.completed = true;
    this.taskService.updateTask(task).subscribe(() => {
      const index = this.taskEditingIds.indexOf(task._id || '');
      if (index > -1) {
        this.taskEditingIds.splice(index, 1);
      }
      this.taskService.loadTasksList();
    });
  }

  onEditTask(task: Task): void {
    if (this.taskEditingIds.includes(task._id || '')) {
      return;
    }

    this.taskService.editTask(task._id || '');

    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '300px',
      height: '300px',
      data: { title: task.title, description: task.description, taskId: task._id, isEdit: true },
      panelClass: 'dialog-background'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        task.title = result.title;
        task.description = result.description;

        this.taskService.updateTask(task).subscribe(() => {
          const index = this.taskEditingIds.indexOf(task._id || '');
          if (index > -1) {
            this.taskEditingIds.splice(index, 1);
          }
          this.taskService.loadTasksList();
        });
      } else {
        const index = this.taskEditingIds.indexOf(task._id || '');
        if (index > -1) {
          this.taskEditingIds.splice(index, 1);
        }
        this.taskService.loadTasksList();
      }
    });
  }
}

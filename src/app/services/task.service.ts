import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private socket: Socket;
  private taskEditing = new Subject<string[]>();
  private tasksLoad = new Subject<boolean>();
  private serverURL: string;

  constructor(private http: HttpClient) {
    if (window.location.hostname === 'localhost') {
      this.serverURL = 'http://localhost:3000';
    } else {
      this.serverURL = 'https://task-app-be.uc.r.appspot.com';
    }
    this.socket = io(this.serverURL);

    this.socket.on('taskEditing', (editingTasks: string[]) => {
      this.taskEditing.next(editingTasks);
    });

    this.socket.on('loadTasks', () => {
      this.tasksLoad.next(true);
    });
  }

  getTasks(): Observable<Task[]> {
    return this.http.get(`${this.serverURL}/api/tasks`).pipe(
      map((response: any) => response.tasks)
    );
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post(`${this.serverURL}/api/tasks`, task).pipe(
      map((response: any) => {
        return response.task
      })
    );
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put(`${this.serverURL}/api/tasks/${task._id}`, task).pipe(
      map((response: any) => response.task)
    );
  }

  deleteTask(task: Task): Observable<void> {
    return this.http.delete(`${this.serverURL}/api/tasks/${task._id}`).pipe(
      map(() => { })
    );
  }

  editTask(taskId: string): void {
    this.socket.emit('editTask', taskId);
  }

  editTaskEnd(taskId: string): void {
    this.socket.emit('taskEditingEnd', taskId);
  }

  loadTasksList(): void {
    this.socket.emit('loadTasks');
  }

  taskEditingObservable(): Observable<string[]> {
    return this.taskEditing.asObservable();
  }

  tasksLoadObservable(): Observable<boolean> {
    return this.tasksLoad.asObservable();
  }
}

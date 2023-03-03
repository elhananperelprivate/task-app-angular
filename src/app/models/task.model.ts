export class Task {
  _id?: string;
  title: string;
  description?: string;
  editing: boolean;
  completed: boolean;

  constructor({ title = '', description = '', editing = false, completed = false } = {}) {
    this.title = title;
    this.description = description;
    this.editing = editing;
    this.completed = completed;
  }
}

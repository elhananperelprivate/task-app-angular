import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTasks'
})
export class FilterTasksPipe implements PipeTransform {
  transform(tasks: any[], searchTerm: string): any[] {
    if (!searchTerm) {
      return tasks;
    }

    searchTerm = searchTerm.toLowerCase();

    return tasks.filter((task) => {
      return task.title.toLowerCase().indexOf(searchTerm) > -1;
    });
  }
}

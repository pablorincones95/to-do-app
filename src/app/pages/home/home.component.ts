
import {
  Component,
  Injector,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Task } from '../../models/task.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public tasks = signal<Task[]>([]);

  filter = signal<'all' | 'pending' | 'completed'>('all');

  tasksByFilter = computed(() => {
    const Filter = this.filter();
    const Tasks = this.tasks();

    if (Filter === 'pending') {
      return Tasks.filter((task) => !task.completed);
    }

    if (Filter === 'completed') {
      return Tasks.filter((task) => task.completed);
    }
    return Tasks;
  });

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  injector = inject(Injector);

  constructor() {}

  ngOnInit() {
    const Storage = localStorage.getItem('tasks');

    if (Storage) {
      const Tasks = JSON.parse(Storage);
      this.tasks.set(Tasks);
    }
    this.trackTask();
  }

  trackTask() {
    effect(
      () => {
        const Tasks = this.tasks();
        console.log('run Effect', Tasks);
        localStorage.setItem('tasks', JSON.stringify(Tasks));
      },
      { injector: this.injector }
    );
  }

  changeHandler() {
    if (this.newTaskCtrl.valid) {
      const Value = this.newTaskCtrl.value.trim();
      if (Value !== '') {
        this.addTask(Value);
        this.newTaskCtrl.setValue('');
      }
    }
  }

  addTask(title: string) {
    const NewTask = {
      id: Date.now(),
      title,
      completed: false,
    };

    this.tasks.update((tasks) => [...tasks, NewTask]);
  }

  updateTask(index: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            completed: !task.completed,
          };
        }
        return task;
      });
    });
  }

  deleteTask(index: number) {
    this.tasks.update((tasks) =>
      tasks.filter((task, position) => position !== index)
    );
  }

  updateTaskEditing(index: number) {
    console.log('weawe');

    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            editing: true,
          };
        }
        return {
          ...task,
          editing: false,
        };
      });
    });
  }

  updateTaskText(index: number, event: Event) {
    const Input = event.target as HTMLInputElement;

    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            title: Input.value,
            editing: false,
          };
        }
        return task;
      });
    });
  }

  changeFilter(filter: 'all' | 'pending' | 'completed') {
    this.filter.set(filter);
  }
}

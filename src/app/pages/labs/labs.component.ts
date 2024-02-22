import { Component, signal } from '@angular/core';

import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.scss',
})
export class LabsComponent {
  public title = 'to-do-app';
  public tasks = signal([
    'Instalar  Angular CLI',
    'Crear app',
    'Crear componentes',
    'Crear servico',
  ]);
  public name = signal('pablo');
  public age = 8;
  public disabled = true;
  public img = 'https://w3schools.com/howto/img_avatar.png';

  public person = signal({
    name: 'pablo',
    age: 19,
    avatar: 'https://w3schools.com/howto/img_avatar.png',
  });

  colorCtrl = new FormControl();
  widthCtrl = new FormControl('50', {
    nonNullable: true,
  });

  nameCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });

  constructor() {
    this.colorCtrl.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }

  clickHandler() {
    alert('Hola');
  }

  changeHandler(event: Event) {
    const INPUT = event.target as HTMLInputElement;
    const NEWVALUE = INPUT.value;
    this.name.set(NEWVALUE);
  }

  keydownHandler(event: KeyboardEvent) {
    const INPUT = event.target as HTMLInputElement;
    console.log(INPUT.value);
  }

  changeAge(event: Event) {
    const INPUT = event.target as HTMLInputElement;
    const NEWVALUE = INPUT.value;
    this.person.update((prevState) => {
      return {
        ...prevState,
        age: parseInt(NEWVALUE),
      };
    });
  }

  changeName(event: Event) {
    const INPUT = event.target as HTMLInputElement;
    const NEWVALUE = INPUT.value;
    this.person.update((prevState) => {
      return {
        ...prevState,
        name: NEWVALUE,
      };
    });
  }
}

import { EventEmitter } from 'eventemitter3';

export interface IComponent {
  container: HTMLElement;
  hide(): void;
  show(): void;
}

export class Component extends EventEmitter implements IComponent {
  public parent: HTMLElement;
  public container: HTMLElement;
  public id: string;

  constructor(parent: HTMLElement, id: string, template: string) {
    super();
    this.parent = parent;
    this.id = id;
    this.container = document.createElement('div');
    this.container.id = id;
    this.container.classList.add('upradio-component');
    this.container.innerHTML = template;
    this.parent.appendChild(this.container);
  }

  show(): void {
    this.container.hidden = false;
    this.container.classList.remove('hidden');
  }
  hide(): void {
    this.container.hidden = true;
    this.container.classList.add('hidden');
  }
}

export * from './Connect';
export * from './ModeSwitch';
export * from './Streams';
export interface IComponent {
  container: HTMLElement;
}

export class Component implements IComponent {
  public container: HTMLElement;

  constructor(container: HTMLElement, template: string) {
    this.container = container;
    this.container.innerHTML = template;
  }
}

export * from './Connect';
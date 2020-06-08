import template from './TargetChannel.component.html';
import { Component } from "..";

export class TargetChannel extends Component {
  constructor(parent: HTMLElement) {
    super(parent, 'UpRadioTargetChannel', template);
    this.parent.classList.add('flex');
    this.parent.classList.add('flex-col');
    this.parent.classList.add('flex-grow');
    this.container.classList.add('flex');
    this.container.classList.add('flex-grow');
    this.container.classList.add('items-center');
  }
}
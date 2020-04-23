import template from './Connect.component.html';
import { Component } from '..';

export default class ConnectComponent extends Component {
  public input: HTMLInputElement;
  public button: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container, template);
    
    this.input = this.container.querySelector('#ConnectInput');
    this.button = this.container.querySelector('#ConnectButton');
  }
}
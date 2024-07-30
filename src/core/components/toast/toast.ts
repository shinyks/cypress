import { Timeout } from '@shinyks/daisy';
import html from './toast.html';
import styles from './toast.scss';
import { name, template, style } from '../../element';
import { Component, ComponentProps } from '../../component';
import { Span } from '../span/span';

export class Toast extends Component {
  fadeTime: number = 300;
  displayTime: number = 1500;

  fadeTimer: Timeout = new Timeout();
  displayTimer: Timeout = new Timeout();

  constructor(props: ComponentProps) {
    super({ ...props, ...template(html, props), ...style(styles, props), ...name('Toast', props), instantAppend: false });

    this.addChild(Span, { id: 'message' });
  }

  fadeIn(callback: () => void): void {
    this.appendElement();

    this.fadeTimer.start(() => {
      this.setOptionOn();

      callback();
    }, 0);
  }

  fadeOut(fadeTime: number = this.fadeTime): void {
    this.setOptionOn(false);

    this.fadeTimer.start(() => {
      this.removeElement();
    }, fadeTime);
  }

  show(message: string, level: string = 'info', displayTime: number = this.displayTime): void {
    this.fadeIn(() => {
      this.setMessageElement(message, level);

      this.displayTimer.start(() => {
        this.fadeOut();
      }, displayTime);
    });
  }

  setMessageElement(message: string, level: string): void {
    const messageComponent = this.getChild('message') as Span | null;

    if (messageComponent) {
      messageComponent.removeAllOption();
      messageComponent.setOption(level);
      messageComponent.text = message;
    }
  }

  setOptionOn(value: boolean = true): void {
    this.setOption('on', value);
  }
}

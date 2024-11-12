import html from './about.html';
import styles from './about.scss';
import { Size } from '@shinyks/daisy';
import { name, template, style } from '../core/element';
import { Component, ComponentProps } from '../core/component';
import { Button, Span } from '../core/components';
import { App } from './app';

export class About<Props extends ComponentProps = ComponentProps> extends Component<Props> {
  get appComponent(): App {
    return this.getRoot() as App;
  }

  constructor(props: Props) {
    super({ ...props, ...template(html, props), ...style(styles, props), ...name('About', props) });

    this.addChild(Span, { text: 'about' });
    this.addChild(Button, { text: 'button', size: new Size(100, 50), onClick: () => this.goHome() });
  }

  goHome(): void {
    this.appComponent.go('home');
  }
}

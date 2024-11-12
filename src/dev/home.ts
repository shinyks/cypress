import html from './home.html';
import styles from './home.scss';
import { Size } from '@shinyks/daisy';
import { name, template, style } from '../core/element';
import { Component, ComponentProps } from '../core/component';
import { Button, Span } from '../core/components';
import { App } from './app';

export class Home<Props extends ComponentProps = ComponentProps> extends Component<Props> {
  get appComponent(): App {
    return this.getRoot() as App;
  }

  constructor(props: Props) {
    super({ ...props, ...template(html, props), ...style(styles, props), ...name('Home', props) });

    this.addChild(Span, { text: 'up' });
    this.addChild(Button, { text: 'button', size: new Size(100, 50), onClick: () => this.goAbout() });
    this.addChild(Span, { text: 'down' });
  }

  goAbout(): void {
    this.appComponent.go('about');
  }
}

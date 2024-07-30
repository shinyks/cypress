import html from './home.html';
import styles from './home.scss';
import { name, template, style } from '../core/element';
import { Component, ComponentProps } from '../core/component';
import { Button } from '../core/components';
import { Span } from '../core/components/span/span';

export class Home<Props extends ComponentProps = ComponentProps> extends Component<Props> {
  constructor(props: Props) {
    super({ ...props, ...template(html, props), ...style(styles, props), ...name('Home', props) });

    this.addChild(Span, { text: 'up' });
    this.addChild(Button, { width: 100, height: 50 });
    this.addChild(Span, { text: 'down' });
  }
}

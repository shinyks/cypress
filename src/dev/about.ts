import html from './about.html';
import styles from './about.scss';
import { name, template, style } from '../core/element';
import { Component, ComponentProps } from '../core/component';
import { Span } from '../core/components/span/span';

export class About<Props extends ComponentProps = ComponentProps> extends Component<Props> {
  constructor(props: Props) {
    super({ ...props, ...template(html, props), ...style(styles, props), ...name('About', props) });

    this.addChild(Span, { text: 'about' });
  }
}

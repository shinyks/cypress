import styles from './span.scss';
import { name, style } from '../../element';
import { Component, ComponentProps } from '../../component';

export interface SpanProps extends ComponentProps {
  text?: string;
}

export class Span<Props extends SpanProps = SpanProps> extends Component<Props> {
  get text(): string {
    return this.props.text ?? '';
  }

  set text(value: string) {
    this.props.text = value;

    this.updateText();
  }

  constructor(props: Props) {
    super({ tagName: 'span', ...props, ...style(styles, props), ...name('Span', props) });

    this.updateText();
  }

  updateText(): void {
    this.addHtml(this.text);
  }
}

import styles from './panel.scss';
import { Size } from '@shinyks/daisy';
import { name, style } from '../../element';
import { Component, ComponentProps } from '../../component';

export interface PanelProps extends ComponentProps {
  size?: Size;
}

export class Panel<Props extends PanelProps = PanelProps> extends Component<Props> {
  get size(): Size {
    return this.props.size ?? Size.default;
  }

  constructor(props: Props) {
    super({ ...props, ...style(styles, props), ...name('Panel', props) });

    this.css.setSize(this.size);
  }
}

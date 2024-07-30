import styles from './panel.scss';
import { Size } from '@shinyks/daisy';
import { name, style } from '../../element';
import { Component, ComponentProps } from '../../component';

export interface PanelProps extends ComponentProps {
  width?: number;
  height?: number;
}

export class Panel<Props extends PanelProps = PanelProps> extends Component<Props> {
  get width(): number {
    return this.props.width ?? 0;
  }

  get height(): number {
    return this.props.height ?? 0;
  }

  constructor(props: Props) {
    super({ ...props, ...style(styles, props), ...name('Panel', props) });

    this.css.setSize(new Size(this.width, this.height));
  }
}

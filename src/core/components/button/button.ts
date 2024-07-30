import styles from './button.scss';
import { Size } from '@shinyks/daisy';
import { name, style } from '../../element';
import { Component, ComponentProps } from '../../component';
import { Span } from '../span/span';

export interface ButtonProps extends ComponentProps {
  title?: string;
  size?: Size;
  imageUrl?: string;
  enable?: boolean;
  select?: boolean;
  onClick?: (() => void);
}

export class Button<Props extends ButtonProps = ButtonProps> extends Component<Props> {
  get title(): string {
    return this.props.title ?? '';
  }

  get imageUrl(): string {
    return this.props.imageUrl ?? '';
  }

  get size(): Size {
    return this.props.size ?? Size.default;
  }

  get enable(): boolean {
    return this.props.enable ?? true;
  }

  set enable(value: boolean) {
    this.props.enable = value;

    this.setOptionEnable(this.enable);
  }

  get select(): boolean {
    return this.props.select ?? false;
  }

  set select(value: boolean) {
    this.props.select = value;

    this.setOptionSelect(this.select);
  }

  get onClick(): (() => void) | null {
    return this.props.onClick ?? null;
  }

  get titleComponent(): Span | null {
    return this.getChild('button-title') as Span | null;
  }

  constructor(props: Props) {
    super({ tagName: 'button', ...props, ...style(styles, props), ...name('Button', props) });

    if (this.title) {
      this.addChild(Span, { id: 'button-title', className: 'title' });
    }

    this.addListener();

    this.setTitle(this.title);
    this.setImage(this.imageUrl);
    this.setSize(this.size);
    this.setOptionEnable(this.enable);
    this.setOptionSelect(this.select);
  }

  addListener(): void {
    if (this.onClick) {
      this.element.addEventListener('click', this.onClick);
    }
  }

  setTitle(title: string): void {
    if (this.titleComponent) {
      this.titleComponent.text = title;
    }
  }

  setImage(imageUrl: string): void {
    if (imageUrl) {
      this.css.set('image-url', `url(${imageUrl})`);
    }
  }

  setSize(size: Size): void {
    if (size.width !== 0 && size.height !== 0) {
      this.css.setSize(size);
    }
  }

  setOptionEnable(value: boolean = true): void {
    this.setOption('enable', value);
  }

  setOptionSelect(value: boolean = true): void {
    this.setOption('select', value);
  }
}

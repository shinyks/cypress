import styles from './button.scss';
import { number, Size } from '@shinyks/daisy';
import { name, style } from '../../element';
import { Component, ComponentProps } from '../../component';
import { Span } from '../span/span';

export interface ButtonProps extends ComponentProps {
  text?: string;
  size?: Size;
  imageUrl?: string;
  highlightUrl?: string;
  enable?: boolean;
  select?: boolean;
  onClick?: (() => void);
}

export class Button<Props extends ButtonProps = ButtonProps> extends Component<Props> {
  get text(): string {
    return this.props.text ?? '';
  }

  get imageUrl(): string {
    return this.props.imageUrl ?? '';
  }

  get highlightUrl(): string {
    return this.props.highlightUrl ?? '';
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

    if (this.text) {
      this.addChild(Span, { id: 'button-title', className: 'title' });
    }

    this.addListener();

    this.setTitle(this.text);
    this.setImage(this.imageUrl, this.highlightUrl);
    this.setSize(this.size);
    this.setOptionEnable(this.enable);
    this.setOptionSelect(this.select);
  }

  addListener(): void {
    if (this.onClick) {
      this.element.addEventListener('click', this.onClick);
    }
  }

  setTitle(text: string): void {
    if (this.titleComponent) {
      this.titleComponent.text = text;
    }
  }

  setImage(imageUrl: string, highlightUrl: string): void {
    if (imageUrl) {
      this.css.set('button-image-url', `url(${imageUrl})`);
    }

    if (highlightUrl) {
      this.css.set('button-highlight-url', `url(${highlightUrl})`);
    }
  }

  setSize(size: Size): void {
    const { width, height } = size;

    if (width !== 0 && height !== 0) {
      this.css.set('button-width', number.to.pxString(width));
      this.css.set('button-height', number.to.pxString(height));
    }
  }

  setOptionEnable(value: boolean = true): void {
    this.setOption('enable', value);
  }

  setOptionSelect(value: boolean = true): void {
    this.setOption('select', value);
  }
}

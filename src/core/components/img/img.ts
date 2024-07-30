import { name } from '../../element';
import { Component, ComponentProps } from '../../component';

export interface ImgProps extends ComponentProps {
  src?: string;
  width?: number;
  height?: number;
}

export class Img<Props extends ImgProps = ImgProps> extends Component<Props> {
  get src(): string {
    return this.props.src ?? '';
  }

  set src(value: string) {
    this.props.src = value;

    this.updateSrc();
  }

  get width(): number {
    return this.props.width ?? 0;
  }

  set width(value: number) {
    this.props.width = value;

    this.updateWidth();
  }

  get height(): number {
    return this.props.height ?? 0;
  }

  set height(value: number) {
    this.props.height = value;

    this.updateHeight();
  }

  get imageElement(): HTMLImageElement {
    return this.element as HTMLImageElement;
  }

  constructor(props: Props) {
    super({ tagName: 'img', ...props, ...name('Img', props) });

    this.updateSrc();
    this.updateWidth();
    this.updateHeight();
  }

  updateSrc(): void {
    this.imageElement.src = this.src;
  }

  updateWidth(): void {
    if (this.width) {
      this.imageElement.width = this.width;
    }
  }

  updateHeight(): void {
    if (this.height) {
      this.imageElement.height = this.height;
    }
  }
}

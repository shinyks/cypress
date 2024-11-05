import styles from './page-scaler.scss';
import { dom, Point, Size } from '@shinyks/daisy';
import { name, style } from '../../element';
import { Component, ComponentProps } from '../../component';

export interface ScaleInfo {
  viewportSize?: Size;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  hCenter?: boolean;
  vCenter?: boolean;
}

export interface PageScalerProps extends ComponentProps {
  scaleInfo?: ScaleInfo;
  allowUserHashControl?: boolean;
}

export class PageScaler<Props extends PageScalerProps = PageScalerProps> extends Component<Props> {
  viewportPoint: Point = Point.default;
  zoomRate: number = 1;

  get scaleInfo(): ScaleInfo {
    return this.props.scaleInfo ?? {};
  }

  set scaleInfo(value: ScaleInfo) {
    this.props.scaleInfo = value;
  }

  get allowUserHashControl(): boolean {
    return this.props.allowUserHashControl ?? true;
  }

  get viewportSize(): Size {
    return this.scaleInfo.viewportSize ?? new Size(1920, 1080);
  }

  get marginTop(): number {
    return this.scaleInfo.marginTop ?? 0;
  }

  get marginRight(): number {
    return this.scaleInfo.marginRight ?? 0;
  }

  get marginBottom(): number {
    return this.scaleInfo.marginBottom ?? 0;
  }

  get marginLeft(): number {
    return this.scaleInfo.marginLeft ?? 0;
  }

  get hCenter(): boolean {
    return this.scaleInfo.hCenter ?? true;
  }

  get vCenter(): boolean {
    return this.scaleInfo.vCenter ?? true;
  }

  get parentSize(): Size {
    const { width, height } = this.parentElement.getBoundingClientRect();

    return new Size(width, height);
  }

  constructor(props: Props) {
    super({ ...props, ...style(styles, props), ...name('PageScaler', props) });

    this.updateLayout();
  }

  updateLayout(): void {
    this.calculateZoomRate();

    const { viewportPoint, viewportSize, zoomRate } = this;

    this.css.setPoint(viewportPoint);
    this.css.setSize(viewportSize);
    this.css.set('transform', `scale(${zoomRate}, ${zoomRate})`);
  }

  updateScaleInfo(scaleInfo: ScaleInfo): void {
    this.scaleInfo = scaleInfo;

    this.updateLayout();
  }

  calculateZoomRate(): void {
    const { hCenter, vCenter, parentSize } = this;
    let horizontalZoom = 0;
    let verticalZoom = 0;

    this.viewportPoint.x = 0;
    this.viewportPoint.y = 0;

    if (this.viewportSize.width !== 0 && this.viewportSize.height !== 0) {
      horizontalZoom = (parentSize.width - this.marginLeft - this.marginRight) / this.viewportSize.width;
      verticalZoom = (parentSize.height - this.marginTop - this.marginBottom) / this.viewportSize.height;
    }

    if (horizontalZoom > verticalZoom) {
      this.zoomRate = verticalZoom;
      this.viewportPoint.x += this.marginLeft;
      this.viewportPoint.y += this.marginTop;

      if (hCenter) {
        const x = (parentSize.width - this.viewportSize.width * this.zoomRate) / 2;

        this.viewportPoint.x = x < this.marginLeft ? this.marginLeft : x;
      }
    } else {
      this.zoomRate = horizontalZoom;
      this.viewportPoint.x += this.marginLeft;
      this.viewportPoint.y += this.marginTop;

      if (vCenter) {
        const y = (parentSize.height - this.viewportSize.height * this.zoomRate) / 2;

        this.viewportPoint.y = y < this.marginTop ? this.marginTop : y;
      }
    }

    this.zoomRate = Math.round(this.zoomRate * 1000000) / 1000000;
  }
}

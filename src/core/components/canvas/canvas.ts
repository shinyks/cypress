import { Point, Size, calc, degree } from '@shinyks/daisy';
import { name } from '../../element';
import { Component, ComponentProps } from '../../component';

export type TextPosition = 'c' | 'se' | 'sc' | 'sw' | 'wc' | 'nw' | 'nc' | 'ne' | 'ec';

export interface CanvasProps extends ComponentProps {
  size?: Size;
}

export class Canvas<Props extends CanvasProps = CanvasProps> extends Component<Props> {
  get size(): Size {
    return this.props.size ?? Size.default;
  }

  get canvasElement(): HTMLCanvasElement {
    return this.element as HTMLCanvasElement;
  }

  get context(): CanvasRenderingContext2D {
    return this.canvasElement.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
  }

  constructor(props: Props) {
    super({ tagName: 'canvas', ...props, ...name('Canvas', props) });

    this.canvasElement.width = this.size.width;
    this.canvasElement.height = this.size.height;
  }

  rect(x: number, y: number, w: number, h: number): Canvas {
    this.context.beginPath();
    this.context.rect(x, y, w, h);

    return this;
  }

  // TODO: context.roundRect 대신 원시 코드로 작성 (브라우저 하위 호환)
  roundRect(x: number, y: number, w: number, h: number, radius: number): Canvas {
    this.context.beginPath();

    // if (this.context.roundRect) {
    // this.context.roundRect(x, y, w, h, radius);
    // } else {
      this.context.rect(x, y, w, h);
    // }

    return this;
  }

  circle(centerX: number, centerY: number, radius: number): Canvas {
    this.context.beginPath();
    this.context.arc(centerX, centerY, radius, 0, Math.PI * 2);

    return this;
  }

  polygon(...points: number[]): Canvas {
    this.context.beginPath();

    for (let i = 0; i < points.length; i += 2) {
      const x = points[i];
      const y = points[i + 1];

      if (i !== 0) {
        this.context.lineTo(x, y);
      } else {
        this.context.moveTo(x, y);
      }
    }

    this.context.closePath();

    return this;
  }

  path(...points: number[]): Canvas {
    this.context.beginPath();

    for (let i = 0; i < points.length; i += 2) {
      const x = points[i];
      const y = points[i + 1];

      if (i !== 0) {
        this.context.lineTo(x, y);
      } else {
        this.context.moveTo(x, y);
      }
    }

    return this;
  }

  pie(x: number, y: number, radius: number, startDegree: number, portionDegree: number): Canvas {
    const baseTopStartRadian = degree.to.radian(startDegree - 90);
    const baseTopEndRadian = degree.to.radian(startDegree - 90 + portionDegree);
    const arcStartPoint = calc.getPointFromRadian(new Point(x, y), baseTopStartRadian, radius);

    this.context.beginPath();
    this.context.moveTo(x, y);
    this.context.lineTo(arcStartPoint.x, arcStartPoint.y);
    this.context.arc(x, y, radius, baseTopStartRadian, baseTopEndRadian);
    this.context.closePath();

    return this;
  }

  clear(): void {
    const { width, height } = this.size;

    this.context.clearRect(0, 0, width, height);
  }

  stroke(color: string = '#000', width: number = 1, dash: Iterable<number> = [], opacity: number = 1, compositeOperation: GlobalCompositeOperation = 'source-over'): Canvas {
    this.context.globalCompositeOperation = compositeOperation;
    this.context.globalAlpha = opacity;
    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';
    this.context.lineWidth = width;
    this.context.strokeStyle = color;
    this.context.setLineDash(dash);
    this.context.stroke();

    return this;
  }

  fill(color: string = '#000', opacity: number = 1, compositeOperation: GlobalCompositeOperation = 'source-over'): Canvas {
    this.context.globalCompositeOperation = compositeOperation;
    this.context.globalAlpha = opacity;
    this.context.fillStyle = color;
    this.context.fill();

    return this;
  }

  strokeText(text: string, x: number, y: number, position: TextPosition = 'c', color: string = '#000', size: number = 20, weight: string = 'normal', lineWidth: number = 1, family: string = 'Nanum Gothic'): void {
    this.setFont(size, weight, family);
    this.setTextPosition(position);

    this.context.strokeStyle = color;
    this.context.lineWidth = lineWidth;
    this.context.strokeText(text, x, y);
  }

  fillText(text: string, x: number, y: number, position: TextPosition = 'c', color: string = '#000', size: number = 20, weight: string = 'normal', family: string = 'Nanum Gothic'): void {
    this.setFont(size, weight, family);
    this.setTextPosition(position);

    this.context.fillStyle = color;
    this.context.fillText(text, x, y);
  }

  setFont(size: number = 20, weight: string = 'normal', family: string = 'Nanum Gothic'): void {
    this.context.font = `${weight} ${size}px ${family}`;
  }

  setTextPosition(position: TextPosition): void {
    if (position === 'ne' || position === 'ec' || position === 'se') {
      this.context.textAlign = 'start';
    } else if (position === 'nc' || position === 'c' || position === 'sc') {
      this.context.textAlign = 'center';
    } else if (position === 'nw' || position === 'wc' || position === 'sw') {
      this.context.textAlign = 'end';
    }

    if (position === 'sw' || position === 'sc' || position === 'se') {
      this.context.textBaseline = 'top';
    } else if (position === 'wc' || position === 'c' || position === 'ec') {
      this.context.textBaseline = 'middle';
    } else if (position === 'nw' || position === 'nc' || position === 'ne') {
      this.context.textBaseline = 'bottom';
    }
  }
}

import { Point, Rect, Size, dom, number } from "@shinyks/daisy";

export class Css {
  element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  set(key: string, value: string): void {
    dom.setCss(this.element, `--${key}`, value);
  }

  getPoint(): Point {
    return dom.getComputedPoint(this.element);
  }

  setPoint({ x, y }: Point): void {
    this.set('left', number.to.pxString(x));
    this.set('top', number.to.pxString(y));
  }

  getSize(): Size {
    return dom.getComputedSize(this.element);
  }

  setSize({ width, height }: Size): void {
    this.set('width', number.to.pxString(width));
    this.set('height', number.to.pxString(height));
  }

  getRect(): Rect {
    const point = this.getPoint();
    const size = this.getSize();

    return new Rect(point.x, point.y, size.width, size.height);
  }

  setRect(rect: Rect): void {
    this.setPoint(rect.getPoint());
    this.setSize(rect.getSize());
  }
}

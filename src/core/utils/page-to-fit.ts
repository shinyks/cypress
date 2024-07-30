import { Point, Size, dom } from '@shinyks/daisy';

export class PageToFit {
  parentSize: Size = Size.default;
  targetSize: Size;
  targetPoint: Point = Point.default;

  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  hCenter: boolean;
  vCenter: boolean;

  zoomRate: number = 1;

  constructor(targetSize: Size, marginTop: number = 0, marginRight: number = 0, marginBottom: number = 0, marginLeft: number = 0, hCenter: boolean = true, vCenter: boolean = true) {
    this.targetSize = targetSize;
    this.marginTop = marginTop;
    this.marginRight = marginRight;
    this.marginBottom = marginBottom;
    this.marginLeft = marginLeft;
    this.hCenter = hCenter;
    this.vCenter = vCenter;
  }

  calculateZoomRate(parentSize: Size = dom.getWindowSize()): void {
    this.parentSize = parentSize;

    let horizontalZoom = 0;
    let verticalZoom = 0;

    this.targetPoint.x = 0;
    this.targetPoint.y = 0;

    if (this.targetSize.width !== 0 && this.targetSize.height !== 0) {
      horizontalZoom = (this.parentSize.width - this.marginLeft - this.marginRight) / this.targetSize.width;
      verticalZoom = (this.parentSize.height - this.marginTop - this.marginBottom) / this.targetSize.height;
    }

    if (horizontalZoom > verticalZoom) {
      this.zoomRate = verticalZoom;
      this.targetPoint.x += this.marginLeft;
      this.targetPoint.y += this.marginTop;

      if (this.hCenter) {
        const x = (this.parentSize.width - this.targetSize.width * this.zoomRate) / 2;

        this.targetPoint.x = x < this.marginLeft ? this.marginLeft : x;
      }
    } else {
      this.zoomRate = horizontalZoom;
      this.targetPoint.x += this.marginLeft;
      this.targetPoint.y += this.marginTop;

      if (this.vCenter) {
        const y = (this.parentSize.height - this.targetSize.height * this.zoomRate) / 2;

        this.targetPoint.y = y < this.marginTop ? this.marginTop : y;
      }
    }

    this.zoomRate = Math.round(this.zoomRate * 1000000) / 1000000;
  }
}

import styles from './app-base.scss';
import { name, style } from "../../element";
import { Component, ComponentProps } from "../../component";
import { ScaleInfo } from '../page-scaler/page-scaler';
import { PageWrapper, RouteInfo } from '../page-wrapper/page-wrapper';
import { Toast } from '../toast/toast';

export interface AppBaseProps extends ComponentProps {
  scaleInfo?: ScaleInfo;
  allowUserHashControl?: boolean;
  useScale?: boolean;
}

export class AppBase<Props extends AppBaseProps = AppBaseProps> extends Component<Props> {
  pageWrapper: PageWrapper;
  toast: Toast;

  get scaleInfo(): ScaleInfo {
    return this.props.scaleInfo ?? {};
  }

  get allowUserHashControl(): boolean {
    return this.props.allowUserHashControl ?? true;
  }

  get useScale(): boolean {
    return this.props.useScale ?? true;
  }

  get zoomRate(): number {
    return this.pageWrapper.zoomRate;
  }

  get urlQueryObject(): any {
    return this.pageWrapper.urlQueryObject;
  }

  constructor(props: Props) {
    super({...props, ...style(styles, props), ...name('AppBase', props) });

    window.addEventListener('resize', this.onResize.bind(this));

    const { scaleInfo, allowUserHashControl, useScale } = this;

    this.pageWrapper = this.addChild(PageWrapper, { scaleInfo, allowUserHashControl, useScale });
    this.toast = this.addChild(Toast);
  }

  onResize(): void {
    if (this.useScale) {
      this.pageWrapper.updateLayout();
    }
  }

  updateScaleInfo(scaleInfo: ScaleInfo): void {
    this.pageWrapper.updateScaleInfo(scaleInfo);
  }

  setRoutes(routes: RouteInfo[]): void {
    this.pageWrapper.setRoutes(routes);
  }

  go(path: string, queryList: any = {}): void {
    this.pageWrapper.go(path, queryList);
  }

  goDefault(queryList: any = {}): void {
    this.pageWrapper.goDefault(queryList);
  }
}

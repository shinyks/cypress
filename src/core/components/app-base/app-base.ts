import styles from './app-base.scss';
import { name, style } from "../../element";
import { Component, ComponentProps } from "../../component";
import { PageWrapper, RouteInfo, ScaleInfo } from '../page-wrapper/page-wrapper';
import { Toast } from '../toast/toast';

export interface AppBaseProps extends ComponentProps {
  scaleInfo?: ScaleInfo;
  allowUserHashControl?: boolean;
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

  get zoomRate(): number {
    return this.pageWrapper.pageScale.zoomRate;
  }

  get urlQueryObject(): any {
    return this.pageWrapper.urlQueryObject;
  }

  constructor(props: Props) {
    super({...props, ...style(styles, props), ...name('AppBase', props) });

    window.addEventListener('resize', this.onResize.bind(this));

    this.pageWrapper = this.addChild(PageWrapper, { scaleInfo: this.scaleInfo, allowUserHashControl: this.allowUserHashControl });
    this.toast = this.addChild(Toast);
  }

  onResize(): void {
    this.pageWrapper.updateLayout();
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

import styles from './app-base.scss';
import { name, style } from "../../element";
import { Component, ComponentProps } from "../../component";
import { PageWrapper, RouteInfo, ScaleInfo } from '../page-wrapper/page-wrapper';
import { Toast } from '../toast/toast';

export interface AppBaseProps extends ComponentProps {
  scaleInfo?: ScaleInfo;
}

export class AppBase<Props extends AppBaseProps = AppBaseProps> extends Component<Props> {
  pageWrapper: PageWrapper;
  toast: Toast;

  get scaleInfo(): ScaleInfo {
    return this.props.scaleInfo ?? {};
  }

  constructor(props: Props) {
    super({...props,  ...style(styles, props), ...name('AppBase', props) });

    window.addEventListener('resize', this.onResize.bind(this));

    this.pageWrapper = this.addChild(PageWrapper, { scaleInfo: this.scaleInfo });
    this.toast = this.addChild(Toast);
  }

  onResize(): void {
    this.pageWrapper.updateLayout();
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

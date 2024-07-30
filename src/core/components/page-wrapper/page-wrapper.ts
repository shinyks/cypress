import styles from './page-wrapper.scss';
import { Size } from '@shinyks/daisy';
import { name, style } from '../../element';
import { Component, ComponentProps } from '../../component';
import { Span } from '../span/span';
import { PageToFit } from '../../utils/page-to-fit';

export interface ScaleInfo {
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  hCenter?: boolean;
  vCenter?: boolean;
}

export interface RouteInfo {
  path: string;
  component: any;
  default?: boolean;
}

export interface PageWrapperProps extends ComponentProps {
  scaleInfo?: ScaleInfo;
  routes?: RouteInfo[]
}

export class PageWrapper<Props extends PageWrapperProps = PageWrapperProps> extends Component<Props> {
  pageScale!: PageToFit;

  get scaleInfo(): ScaleInfo {
    return this.props.scaleInfo ?? {};
  }

  get routes(): RouteInfo[] {
    return this.props.routes ?? [];
  }

  set routes(routes: RouteInfo[]) {
    this.props.routes = routes;
  }

  get scaleWidth(): number {
    return this.scaleInfo.width ?? 1280;
  }

  get scaleHeight(): number {
    return this.scaleInfo.height ?? 720;
  }

  get scaleSize(): Size {
    return new Size(this.scaleWidth, this.scaleHeight);
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

  get defaultRoutePath(): string {
    const filteredList = this.routes.filter((route: RouteInfo) => route.default === true);

    return filteredList.length !== 0 ? filteredList[0].path : (this.routes[0]?.path ?? '');
  }

  get urlHash(): string {
    return window.location.hash.split('?')[0].split('#').pop() ?? '';
  }

  get urlSearch(): string {
    let search = window.location.search.replace('?', '');

    if (window.location.hash.includes('?')) {
      if (search) {
        search += '&';
      }

      search += window.location.hash.split('?')[1];
    }

    return search;
  }

  constructor(props: Props) {
    super({ ...props, ...style(styles, props), ...name('PageWrapper', props), autoId: true });

    this.initPageScale();
    this.initDefaultComponent();
    this.updateLayout();
  }

  initPageScale(): void {
    const { marginTop, marginRight, marginBottom, marginLeft, hCenter, vCenter } = this;

    this.pageScale = new PageToFit(this.scaleSize, marginTop, marginRight, marginBottom, marginLeft, hCenter, vCenter);
  }

  initDefaultComponent(): void {
    this.addChild(Span, { text: 'Page load failed' });
  }

  updateLayout(): void {
    this.pageScale.calculateZoomRate();

    const { targetPoint, targetSize, zoomRate } = this.pageScale;

    this.css.setPoint(targetPoint);
    this.css.setSize(targetSize);
    this.css.set('transform', `scale(${zoomRate}, ${zoomRate})`);
  }

  setRoutes(routes: RouteInfo[]): void {
    this.routes = routes;

    const { urlHash, urlSearch } = this;
    const queryList = this.stringToRecordList(urlSearch);

    if (urlHash) {
      this.go(this.urlHash, queryList);
    } else {
      this.goDefault(queryList);
    }
  }

  go(path: string, queryList: Record<string, string>[] = []): void {
    const route = this.getRoute(path);

    if (route) {
      let path = '';

      if (queryList.length !== 0) {
        path += `?${this.recordListToString(queryList)}`;
      }

      path += `#${route.path}`;

      window.history.pushState('', '', path);

      this.destroyAllChild();
      this.addChild(route.component, {});
    }
  }

  goDefault(queryList: Record<string, string>[] = []): void {
    this.go(this.defaultRoutePath, queryList);
  }

  getRoute(path: string): RouteInfo | null {
    const filteredList = (this.routes).filter((route: RouteInfo) => route.path === path);
    let route = null;

    if (filteredList.length > 0) {
      route = filteredList[0];
    }

    return route;
  }

  stringToRecordList(searchString: string): Record<string, string>[] {
    const recordList: Record<string, string>[] = [];
    const pairList = searchString.split('&');

    pairList.forEach((pair) => {
      const chunks = pair.split('=');
      const key = chunks[0];
      const value = chunks[1];
      const object = {};

      if (key && value) {
        (object as any)[key] = value;

        recordList.push(object);
      }
    });

    return recordList;
  }

  recordListToString(recordList: Record<string, string>[]): string {
    const searchList: string[] = [];

    recordList.forEach((record) => {
      const key = Object.keys(record)[0];
      const value = Object.values(record)[0];

      searchList.push(`${key}=${value}`);
    });

    return searchList.join('&');
  }
}

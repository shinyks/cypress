import styles from './page-wrapper.scss';
import { string } from '@shinyks/daisy';
import { name, style } from '../../element';
import { PageScaler, PageScalerProps } from '../page-scaler/page-scaler';
import { Span } from '../span/span';

export interface RouteInfo {
  path: string;
  component: any;
  default?: boolean;
}

export interface PageWrapperProps extends PageScalerProps {
  routes?: RouteInfo[];
}

export class PageWrapper<Props extends PageWrapperProps = PageWrapperProps> extends PageScaler<Props> {
  get routes(): RouteInfo[] {
    return this.props.routes ?? [];
  }

  set routes(routes: RouteInfo[]) {
    this.props.routes = routes;
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

  get urlQueryObject(): any {
    return this.searchStringToObject(this.urlSearch);
  }

  constructor(props: Props) {
    super({ ...props, ...style(styles, props), ...name('PageWrapper', props), autoId: true });

    this.initDefaultComponent();
  }

  initDefaultComponent(): void {
    this.addChild(Span, { text: 'Page load failed' });
  }

  setRoutes(routes: RouteInfo[]): void {
    this.routes = routes;

    if (!this.allowUserHashControl) {
      this.goDefault();

      return;
    }

    const { urlHash, urlQueryObject } = this;

    if (urlHash) {
      this.go(this.urlHash, urlQueryObject);
    } else {
      this.goDefault(urlQueryObject);
    }
  }

  go(path: string, queryObject: any = {}): void {
    const route = this.getRoute(path);

    if (route) {
      let path = '';

      if (Object.entries(queryObject).length !== 0) {
        path += `?${this.objectToSearchString(queryObject)}`;
      }

      path += `#${route.path}`;

      window.history.pushState('', '', path);

      this.destroyAllChild();
      this.addChild(route.component, {});
    }
  }

  goDefault(queryObject: any = {}): void {
    this.go(this.defaultRoutePath, queryObject);
  }

  getRoute(path: string): RouteInfo | null {
    const filteredList = (this.routes).filter((route: RouteInfo) => route.path === path);
    let route = null;

    if (filteredList.length > 0) {
      route = filteredList[0];
    }

    return route;
  }

  searchStringToObject(searchString: string): any {
    const searchObject: any = {};
    const pairList = searchString.split('&');

    pairList.forEach((pair) => {
      const chunks = pair.split('=');
      const key = chunks[0];
      const value = chunks[1];

      if (key && value) {
        searchObject[string.to.camelCase(key)] = value;
      }
    });

    return searchObject;
  }

  objectToSearchString(searchObject: any): string {
    const searchList: string[] = [];

    Object.entries(searchObject).forEach(([key, value]) => {
      searchList.push(`${string.to.kebabCase(key)}=${value}`);
    });

    return searchList.join('&');
  }
}

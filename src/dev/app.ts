import html from './app.html';
import { Size } from '@shinyks/daisy';
import { name, template } from "../core/element";
import { AppBase } from "../core/components";
import { ScaleInfo } from '../core/components/page-scaler/page-scaler';
import { RouteInfo } from '../core/components/page-wrapper/page-wrapper';
import { Home } from './home';
import { About } from './about';

const scaleInfo: ScaleInfo = {
  viewportSize: new Size(1920, 1080),
};

const routes: RouteInfo[] = [
  { path: 'home', component: Home, default: true },
  { path: 'about', component: About },
];

export class App extends AppBase {
  constructor() {
    super({ scaleInfo, ...template(html), ...name('App'), autoId: true, allowUserHashControl: false });

    this.setRoutes(routes);
  }
}

new App();

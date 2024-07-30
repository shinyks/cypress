import html from './app.html';
import { name, template } from "../core/element";
import { AppBase } from "../core/components";
import { RouteInfo, ScaleInfo } from '../core/components/page-wrapper/page-wrapper';
import { Home } from './home';
import { About } from './about';

const scaleInfo: ScaleInfo = {
  width: 1920,
  height: 1080,
};

const routes: RouteInfo[] = [
  { path: 'home', component: Home, default: true },
  { path: 'about', component: About },
];

class App extends AppBase {
  constructor() {
    super({ scaleInfo, ...template(html), ...name('App'), autoId: true });

    this.setRoutes(routes);
  }
}

new App();

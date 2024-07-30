import { v4 as uuidv4 } from 'uuid';
import { Element, ElementProps } from './element';

export interface ComponentProps extends ElementProps {
  parentComponent?: Component | null;
  instantAppend?: boolean;
}

export class Component<Props extends ComponentProps = ComponentProps> extends Element<Props> {
  uid: string;
  childComponentList: Component[] = [];
  active: boolean = true;

  get parentComponent(): Component | null {
    return this.props.parentComponent ?? null;
  }

  get instantAppend(): boolean {
    return this.props.instantAppend ?? true;
  }

  constructor(props: Props) {
    super(props);

    this.uid = uuidv4();

    if (!this.create(this.instantAppend)) {
      this.destroy();

      throw Error(`Duplicated ID: ${this.id}`);
    }
  }

  /**
   * 컴포넌트 생성
   * @param {boolean} instantAppend - 생성된 객체를 바로 DOM에 추가 (기본 값: true)
   */
  create(instantAppend: boolean = true): boolean {
    if (this.find(this.id)) {
      return false;
    }

    if (instantAppend) {
      this.appendElement();
    }

    return true;
  }

  /**
   * 컴포넌트 제거
   */
  destroy(): void {
    this.destroyAllChild();
    this.removeElement();

    this.active = false;

    if (this.parentComponent) {
      this.parentComponent.filterActiveChild();
    }
  }

  addChild<T extends Component>(constructor: new (props: any) => T, props: any = {}): T {
    const component = new constructor({ parentComponent: this, parentElement: this.element, ...props });

    this.filterActiveChild();
    this.childComponentList.push(component);

    return component;
  }

  getChild(id: string): Component | null {
    const filteredList = this.childComponentList.filter((component) => component.id === id);

    return filteredList.length === 0 ? null: filteredList[0];
  }

  getChildren(idStartsWith: string = ''): Component[] {
    return this.childComponentList.filter((component) => component.id.startsWith(idStartsWith));
  }

  destroyAllChild(): void {
    this.childComponentList.forEach((component) => component.destroy());
    this.filterActiveChild();
  }

  filterActiveChild(): void {
    this.childComponentList = this.childComponentList.filter(component => component.active);
  }

  getRoot(): Component {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let component: Component = this;

    while (component.parentComponent !== null) {
      component = component.parentComponent;
    }

    return component;
  }

  findParent(id: string): Component | null {
    let component = this.parentComponent;

    while (component && component.id !== id) {
      component = component.parentComponent;
    }

    return component;
  }

  findChild(id: string, startComponent: Component = this): Component | null {
    if (id.length === 0) {
      return null;
    }

    const componentList = [...startComponent.childComponentList];
    let component: Component | undefined;

    do {
      component = componentList.shift();

      if (component) {
        componentList.push(...component.childComponentList);
      }
    } while (component && component.id !== id);

    return component ? component : null;
  }

  find(id: string): Component | null {
    return this.findChild(id, this.getRoot());
  }
}

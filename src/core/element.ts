import { dom, string } from '@shinyks/daisy';
import { Css } from './css';

export const name = (name: string, props?: ElementProps): any => {
  const kebabCase = string.to.kebabCase(name);
  const nameList = props?.nameList ?? [];

  nameList.push(kebabCase);

  return { nameList };
};

export const className = (className: string, props?: ElementProps): any => {
  const mergedClassName = string.merge.withDelimeter(props?.className ?? '', className);

  return { className: mergedClassName };
};

export const template = (template: string, props?: ElementProps): any => {
  const mergeTag = '<template></template>';
  const childTemplate = props?.template ?? '';
  let mergedTemplate = '';

  if (template.includes(mergeTag)) {
    mergedTemplate = template.replace(mergeTag, childTemplate);
  } else {
    mergedTemplate = template + childTemplate;
  }

  return { template: mergedTemplate };
};

export const style = (style: any, props?: ElementProps): any => {
  const styleList = props?.styleList ?? [];

  styleList.push(style);

  return { styleList };
};

export interface ElementProps {
  id?: string;
  autoId?: boolean;
  nameList?: string[];
  className?: string;
  tagName?: string;
  parentElement?: HTMLElement;
  siblingIndex?: number;
  template?: string;
  styleList?: any[];
}

export class Element<Props extends ElementProps = ElementProps> {
  props: Props;
  element: HTMLElement;
  css: Css;

  get id(): string {
    return this.props.id ?? '';
  }

  get autoId(): boolean {
    return this.props.autoId ?? false;
  }

  get nameList(): string[] {
    return this.props.nameList ?? [];
  }

  get className(): string {
    return this.props.className ?? '';
  }

  get tagName(): string {
    return this.props.tagName ?? 'div';
  }

  get parentElement(): HTMLElement {
    return this.props.parentElement ?? document.body;
  }

  get siblingIndex(): number | undefined {
    return this.props.siblingIndex;
  }

  get template(): string {
    return this.props.template ?? '';
  }

  get styleList(): any[] {
    return this.props.styleList ?? [];
  }

  constructor(props: Props) {
    this.props = props;

    this.element = this.createElement(this.tagName, this.className, this.id);
    this.css = new Css(this.element);

    this.addName();
    this.addHtml(this.template);
    this.addStyle();
  }

  addName(): void {
    if (this.autoId && !this.id && this.nameList[0]) {
      this.element.id = this.nameList[0];
    }

    this.nameList.forEach((name) => {
      this.element.classList.add(`${name}-host`);
    });
  }

  addHtml(value: string): void {
    dom.setHtml(this.element, value);
  }

  addStyle(): void {
    const styleList = [...this.styleList];

    styleList.reverse().forEach((style) => {
      if (style.use) {
        style.use();
      } else {
        dom.addStyle(style);
      }
    });
  }

  createElement(tag: string = 'div', className: string = '', id: string = ''): HTMLElement {
    return dom.create(tag, className, id);
  }

  appendElement(): void {
    dom.append(this.element, this.parentElement, this.siblingIndex);
  }

  removeElement(): void {
    dom.remove(this.element);
  }

  toggleAppend(): void {
    if (this.isAppended()) {
      this.removeElement();
    } else {
      this.appendElement();
    }
  }

  isAppended(): boolean {
    return this.element.parentElement ? true : false;
  }

  appendChildElement(element?: HTMLElement | null, index?: number): void {
    if (element) {
      dom.append(element, this.element, index);
    }
  }

  getChildElement(query: string): HTMLElement | null {
    return dom.get(query, this.element);
  }

  getData(key: string): string | null {
    return this.element.dataset[key] ?? null;
  }

  setData(key: string, value: string): void {
    this.element.dataset[key] = value;
  }

  setOption(name: string, value: boolean = true): void {
    dom.setOptionClass(this.element, name, value);
  }

  hasOption(name: string): boolean {
    return dom.hasOptionClass(this.element, name);
  }

  removeAllOption(): void {
    dom.removeAllOptionClass(this.element);
  }

  setStatus(name: string, value: boolean = true): void {
    dom.setOptionClass(document.body, `status-${name}`, value);
  }

  hasStatus(name: string): boolean {
    return dom.hasOptionClass(document.body, `status-${name}`);
  }

  removeAllStatus(): void {
    dom.removeAllClass(document.body, '--status-');
  }
}

function insertIntoTarget(element: HTMLElement, options: any): void {
  (options.target || document.head).appendChild(element);
}

export default insertIntoTarget;

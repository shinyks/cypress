import styles from './core/styles/default.scss';

const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export * from './core/element';
export * from './core/component';
export * from './core/components';
export * from './core/utils';

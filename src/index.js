// import 'promise-polyfill';
// import 'isomorphic-fetch';
import { h, render } from 'preact';
// import './style';

let root;
function init(elementName, options) {
  const rootContainer = document.querySelector(elementName)
  let App = require('./components/app').default;
  const appDom = <App {...options}/>
  root = render(appDom, rootContainer, root)
  return {
    root: root,
    app: appDom,
    rootName: elementName,
  }
}

// register ServiceWorker via OfflinePlugin, for prod only:
if (process.env.NODE_ENV === 'production') {
  require('./pwa');
}

// in development, set up HMR:
if (module.hot) {
  //require('preact/devtools');   // turn this on if you want to enable React DevTools!
  module.hot.accept('./components/app', () => requestAnimationFrame(function () {
    init('#main-board')
  }));
}

// init('#main-board');
window.initPlayBoard = init

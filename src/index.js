// import con from 'h5debug'
import VConsole from 'vconsole'
import con from './console';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
con.setRootEleSelector('#root');
// var vConsole = new VConsole();

ReactDOM.render(<App />, document.getElementById('root'));




registerServiceWorker();

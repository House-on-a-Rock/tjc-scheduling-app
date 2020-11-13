import React from 'react';
import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux';

// import App from './app';
// import { store } from './store';

const Root = () => {
  return (
    <div>Hello World</div>
    // <Provider store={store}>
    // <App />
    // </Provider>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));

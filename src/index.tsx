import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './app';

const Root = () => {
  return (
    <div>
      <App />
    </div>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));

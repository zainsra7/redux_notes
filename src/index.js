import React from 'react';
// import { createStore } from 'redux';
import {createStore} from './createStore';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';

const counter = (state=0, action) => {
  switch(action.type){
    case INCREMENT:
      return state + 1;
    case DECREMENT:
      return state - 1;
      default:
        return state;
  }
}
const store = createStore(counter);

const Counter = ({value, onIncrement, onDecrement}) => (
  <div>
    <h1>{value}</h1>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
  </div>
  );


const render = () => ReactDOM.render(
  <React.StrictMode>
    <Counter 
    value={store.getState()} 
    onIncrement={() => store.dispatch({type: INCREMENT})} 
    onDecrement={() => store.dispatch({type: DECREMENT})} />
  </React.StrictMode>,
  document.getElementById('root')
);

store.subscribe(render);
render();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

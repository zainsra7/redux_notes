import React from 'react';
// import { createStore } from 'redux';
import {createStore} from './createStore';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const ADD_TODO = "ADD_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";

const todo = (state, action) => {
  switch(action.type){
    case ADD_TODO: 
      return {
          id: action.id,
          text: action.text,
          completed: false
        }
    case TOGGLE_TODO: 
      if (state.id !== action.id){
          return state; 
        }
      return {
        ...state,
        completed: !state.completed
      }
    default: 
    return state;
  }
}

const todos = (state = [], action) => {
  switch(action.type){
    case ADD_TODO:
      return [
        ...state,
        todo(undefined, action)
      ];
    case TOGGLE_TODO: 
      return state.map(t => todo(t, action));
    default:
      return state;
  }
}

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

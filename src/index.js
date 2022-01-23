import React from 'react';
// import { createStore } from 'redux';
import {createStore} from './createStore';
import ReactDOM from 'react-dom';
import './index.css';
import Counter from './components/Counter';
import {counterReducer} from './components/Counter/reducer';
import {INCREMENT, DECREMENT} from './components/Counter/reducer';
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

const visibilityFilter = (state = "SHOW_ALL", action) => {
  switch(action.type){
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default: 
      return state;
  }
}

const todoAppReducer = (state = {}, action) => {
  return {
    todos: todos(state.todos, action),
    visibilityFilter: visibilityFilter(state.visibilityFilter, action)
  }
}

const TodoApp = ({todos, visibilityFilter}) => (
  <div>
    <ul>
      {todos.map(todo => <li>{todo.text}</li>)}
    </ul>
  </div>
) 

const store = createStore(todoAppReducer);

const render = () => ReactDOM.render(
  <React.StrictMode>
    <TodoApp 
    todos={store.getState().todos} 
    visibilityFilter={store.getState().visibilityFilter} 
     />
  </React.StrictMode>,
  document.getElementById('root')
);

store.subscribe(render);
render();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

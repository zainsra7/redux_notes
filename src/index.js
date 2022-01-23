import React from 'react';
import { combineReducers } from './combinedReducers';
import {  createStore   } from './createStore';
import ReactDOM from 'react-dom';
import './index.css';

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

const todoAppReducer = combineReducers({todos,visibilityFilter});

const TodoApp = ({todos, visibilityFilter, addTodoHandler, toggleTodoHandler}) => (
  <div>
    <ul>
      {todos.map(todo => 
      <div>
        <li key={todo.id}>
          {todo.completed? <strike>{todo.text}</strike> : todo.text}
        </li>
      </div>
      )}
    </ul>
    <button onClick={addTodoHandler}>ADD_TODO</button>
  </div>
) 

const store = createStore(todoAppReducer);

let todoId = 0;

const render = () => ReactDOM.render(
  <React.StrictMode>
    <TodoApp 
    todos={store.getState().todos} 
    visibilityFilter={store.getState().visibilityFilter} 
    addTodoHandler={()=> store.dispatch({
      type: ADD_TODO,
      id: todoId++,
      text: 'New_TODO'
    })}
     />
  </React.StrictMode>,
  document.getElementById('root')
);

store.subscribe(render);
render();

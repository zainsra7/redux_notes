import React from 'react';
import {useRef} from 'react';
import { combineReducers } from './combinedReducers';
import {  createStore   } from './createStore';
import ReactDOM from 'react-dom';
import './index.css';

const ADD_TODO = "ADD_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';
const SHOW_ALL = "SHOW_ALL";
const SHOW_ACTIVE = "SHOW_ACTIVE";
const SHOW_COMPLETED = "SHOW_COMPLETED";

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

const visibilityFilter = (state = SHOW_ALL, action) => {
  switch(action.type){
    case SET_VISIBILITY_FILTER:
      return action.filter;
    default: 
      return state;
  }
}

const FilterLink = ({
  filter, 
  children,
  currentFilter
}) => {
  if(filter === currentFilter) return <span>{children}</span>
  return (
    <a 
    href='_'
    onClick={e => {
      e.preventDefault();
      store.dispatch({
        type: SET_VISIBILITY_FILTER,
        filter
      })
    }}
    >
      {children}
    </a>
  )
};

const getVisibleTodos = (todos, filter) => {
  switch(filter){
    case SHOW_ACTIVE:
      return todos.filter(todo => !todo.completed);
    case SHOW_COMPLETED:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}


let nextTodoId = 0;

const TodoApp = ({todos, visibilityFilter}) => {
  const inputEl = useRef(null);
  const visibileTodos = getVisibleTodos(todos,visibilityFilter);

  return(
    <div>
      <input ref={inputEl} type="text" />
      <ul>
        {visibileTodos.map(todo => 
        <div>
          <li key={todo.id}
            onClick={() => {
              store.dispatch({
                type: TOGGLE_TODO,
                id: todo.id
              });
            }}
          >
            {todo.completed? <strike>{todo.text}</strike> : todo.text}
          </li>
        </div>
        )}
      </ul>
      <button onClick={() => {
        if(inputEl.current.value !== ''){
          store.dispatch({
            type: ADD_TODO,
            id: nextTodoId++,
            text: inputEl.current.value
          })
          inputEl.current.value = '';
        }
      }}>
        ADD TODO
      </button>
      <p>
        Show: 
        <br />
        <FilterLink filter={SHOW_ALL} currentFilter={visibilityFilter}>{SHOW_ALL}</FilterLink>
        <br />
        <FilterLink filter={SHOW_ACTIVE} currentFilter={visibilityFilter}>{SHOW_ACTIVE}</FilterLink>
        <br />
        <FilterLink filter={SHOW_COMPLETED} currentFilter={visibilityFilter}>{SHOW_COMPLETED}</FilterLink>
      </p>
    </div>
)};


const todoApp = combineReducers({todos,visibilityFilter});

const store = createStore(todoApp);

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

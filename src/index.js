import React from 'react';
import {  useRef } from 'react';
import { combineReducers } from './combinedReducers';
import {  createStore   } from './createStore';
import {  Provider, useDispatch, useSelector } from 'react-redux';
import ReactDOM from 'react-dom';

// Constants
const ADD_TODO = "ADD_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';
const SHOW_ALL = "SHOW_ALL";
const SHOW_ACTIVE = "SHOW_ACTIVE";
const SHOW_COMPLETED = "SHOW_COMPLETED";

// Global variables
let nextTodoId = 0;
// Utility func
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

// Reducers
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

// Redux store setup
const todoApp = combineReducers({todos,visibilityFilter});

// Action Creators
const addTodo = (text) => ({
  type: ADD_TODO,
  id: nextTodoId++,
  text,
});
const setVisibilityFilter = (filter) => ({
  type: SET_VISIBILITY_FILTER,
  filter
});
const toggleTodo = (id) => ({
  type: TOGGLE_TODO,
  id
});

// Presentational (UI) Components
const Footer = () => (
  <p>
    Show: 
    <br />
    <Link filter={SHOW_ALL}>{SHOW_ALL}</Link>
    <br />
    <Link filter={SHOW_ACTIVE}>{SHOW_ACTIVE}</Link>
    <br />
    <Link filter={SHOW_COMPLETED}>{SHOW_COMPLETED}</Link>
  </p>
);
const Link = ({
filter,
children,
}) => {
  const visibilityFilter = useSelector(state => state.visibilityFilter);
  const dispatch = useDispatch();

  if(filter === visibilityFilter) return <span>{children}</span>
  return (
    <a
    href="_"
    onClick={e => {
      e.preventDefault();
      dispatch(setVisibilityFilter(filter))
    }}
    >
      {children}
    </a>
  );
};
const TodoList = () => {
  const todos = useSelector(state => state.todos);
  const visibilityFilter = useSelector(state => state.visibilityFilter);
  const visibileTodos = getVisibleTodos(todos,visibilityFilter);
  const dispatch = useDispatch();

return(
  <ul>
    {visibileTodos.map(todo => 
      <Todo 
        key={todo.id}
        {...todo}
        onClick={() => dispatch(toggleTodo(todo.id))}
      />
    )}
  </ul>
  )
};
const Todo = ({
  onClick,
  completed, 
  text
}) => (
  <li 
    onClick={onClick}
  >
    {completed? <strike>{text}</strike> : text}
  </li>
);

const AddTodo = () => {
  const inputEl = useRef(null);
  const dispatch = useDispatch();
  return (
    <div>
      <input ref={inputEl} type="text" />
      <button onClick={() => {
        if(inputEl.current.value !== ""){
          dispatch(addTodo(inputEl.current.value))
          inputEl.current.value="";
        }
      }}
      >
        Add Todo
      </button>
    </div>
  );
}

// Main app render
const TodoApp = () => {
  return(
    <div>
      <AddTodo />
      <TodoList />
      <Footer />
    </div>
)};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createStore(todoApp)}>
      <TodoApp />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
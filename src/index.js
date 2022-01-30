import React from 'react';
import {  useRef } from 'react';
import { combineReducers } from './combinedReducers';
import {  createStore   } from './createStore';
import {  Provider, connect } from 'react-redux';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

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

// Presentational (UI) Components
const Footer = () => (
  <p>
    Show: 
    <br />
    <FilterLink filter={SHOW_ALL}>{SHOW_ALL}</FilterLink>
    <br />
    <FilterLink filter={SHOW_ACTIVE}>{SHOW_ACTIVE}</FilterLink>
    <br />
    <FilterLink filter={SHOW_COMPLETED}>{SHOW_COMPLETED}</FilterLink>
  </p>
);
const Link = ({
active,
children,
onClick
}) => {
  if(active) return <span>{children}</span>
  return (
    <a
    href="_"
    onClick={e => {
      e.preventDefault();
      onClick();
    }}
    >
      {children}
    </a>
  );
};
const TodoList = ({
  todos,
  onTodoClick,
}) => (
  <ul>
    {todos.map(todo => 
      <Todo 
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
);
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

// Action Creators
const addTodo = (text) => {
  return {
    type: ADD_TODO,
    id: nextTodoId++,
    text,
  };
};
const setVisibilityFilter = (filter) => {
  return {
    type: SET_VISIBILITY_FILTER,
    filter
  };
};
const toggleTodo = (id) => {
  return {
    type: TOGGLE_TODO,
    id
  };
};

// Container Components
const mapStateToLinkProps = (state, ownProps) => {
  return{
    active: ownProps.filter === state.visibilityFilter
  }
};

const mapDispatchToLinkProps = (dispatch, ownProps) => {
  return{
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  }
}

const FilterLink = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Link);

const mapStateToListProps = (state) => {
  return {
    todos: getVisibleTodos(
      state.todos,
      state.visibilityFilter
    )
  };
};

const mapDispatchToListProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    }
  };
};

const VisibileTodoList = connect(mapStateToListProps, mapDispatchToListProps)(TodoList);

let AddTodo = ({dispatch}) => {
  const inputEl = useRef(null);
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
AddTodo = connect()(AddTodo);


// Main app render
const TodoApp = () => {
  return(
    <div>
      <AddTodo />
      <VisibileTodoList />
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
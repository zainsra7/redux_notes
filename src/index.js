import React from 'react';
import {  useRef } from 'react';
import { combineReducers } from './combinedReducers';
import {  createStore   } from './createStore';
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

// Presentational (UI) Components
const Footer = ({store}) => (
  <p>
    Show: 
    <br />
    <FilterLink filter={SHOW_ALL} store={store}>{SHOW_ALL}</FilterLink>
    <br />
    <FilterLink filter={SHOW_ACTIVE} store={store}>{SHOW_ACTIVE}</FilterLink>
    <br />
    <FilterLink filter={SHOW_COMPLETED} store={store}>{SHOW_COMPLETED}</FilterLink>
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

// Container Components
class FilterLink extends React.Component {
  componentDidMount(){
    this.unsubscribe = this.props.store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount(){
    this.unsubscribe();
  }
  render(){
    const {
      filter,
      children,
      store
    } = this.props;
    const { 
      visibilityFilter 
    } = store.getState();

    return (
      <Link 
        active={visibilityFilter === filter}
        onClick={() => store.dispatch({
          type: SET_VISIBILITY_FILTER,
          filter
        })}
      >
        {children}
      </Link>
    );
  }
}
class VisibileTodoList extends React.Component {
  componentDidMount(){
    this.unsubscribe = this.props.store.subscribe(() => this.forceUpdate());
  }
  componentWillUnmount(){
    this.unsubscribe();
  }
  render(){
    const {store} = this.props;
    const {todos, visibilityFilter} = store.getState();
    return(
      <TodoList 
        todos={getVisibleTodos(todos,visibilityFilter)}
        onTodoClick={id => store.dispatch({
          type: TOGGLE_TODO,
          id
        })}
      />
    );
  }
}
const AddTodo = ({store}) => {
  const inputEl = useRef(null);
  return (
    <div>
      <input ref={inputEl} type="text" />
      <button onClick={() => {
        if(inputEl.current.value !== ""){
          store.dispatch({
            type: ADD_TODO,
            id: nextTodoId++,
            text: inputEl.current.value
          })
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
const TodoApp = ({store}) => {
  return(
    <div>
      <AddTodo store={store}/>
      <VisibileTodoList store={store}/>
      <Footer store={store}/>
    </div>
)};

ReactDOM.render(
  <React.StrictMode>
    <TodoApp store={createStore(todoApp)}/>
  </React.StrictMode>,
  document.getElementById('root')
);
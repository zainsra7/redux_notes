export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';

export const counterReducer = (state=0, action) => {
  switch(action.type){
    case INCREMENT:
      return state + 1;
    case DECREMENT:
      return state - 1;
      default:
        return state;
  }
}
export const createStore = (reducer) => {
    let state;
    let listeners = [];

    const getState = () => state;
    const dispatch = (action) => {
        state = reducer(state, action);
        listeners.forEach(listeners => listeners());
    }
    const subscribe = (callback) => {
        listeners.push(callback);
        return () => {
            listeners = listeners.filter(listener => listener !== callback);
        }
    };
    dispatch({});

    return {getState, dispatch, subscribe};
}
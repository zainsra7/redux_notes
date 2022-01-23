export const combineReducers = reducers => {
    // Reduce all keys for reducers from 'todos' and 'visibilityFilter'
    return (state = {}, action) => {
        return Object.keys(reducers).reduce( 
            (nextState, key) => {
                nextState[key] = reducers[key](
                    state[key],
                    action
                );
                return nextState;
            },
            {} // iniital empty object
        );
    };
};
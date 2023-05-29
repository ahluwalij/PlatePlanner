import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    token: null,
    error: null,
    loading: false
}

const authStart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true
    });
}

const authSuccess = (state, action) => {
    return updateObject(state, {
        token: action.token,
        error: null,
        loading: false
    });
}

const authFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    });
}

const authLogout = (state, action) => {
    return updateObject(state, {
        token: null
    });
}

// define when the above reducers actually take place
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START:
            return authStart(action, state);
        case actionTypes.AUTH_SUCCESS:
            return authSuccess(action, state);
        case actionTypes.AUTH_FAIL:
            return authFail(action, state);
        case actionTypes.AUTH_LOGOUT:
            return authLogout(action, state);
        default:
            return state;
    }
}

export default reducer;
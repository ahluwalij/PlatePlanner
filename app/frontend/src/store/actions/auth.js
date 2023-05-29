import * as actionTypes from './actionTypes';
import axios from 'axios';

// What to do based on the type of action 
export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

// successful logins have an authentication token
export const authSuccess = token => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token
    }
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        token: null,
        error: 34
    }
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

// checks to see if the authentication token expired
export const checkAuthTimeout = expirationTime => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000)
        // convert it from miliseconds to seconds
    }
}

// Parameters to log in
export const authLogin = (username, password) => {
    // alert us that the auth start has taken place
    return dispatch => {
        dispatch(authStart());
        axios.post('/rest-auth/login/', {
            username: username,
            password: password
        })
            // see what the response to this post request is
            .then(res => {
                const token = res.data.key;
                const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
                // need to store this data in a persistant storage
                // (not redux bc when refreshed, the data would be lost)
                localStorage.setItem('token', token);
                localStorage.setItem('expirationDate', expirationDate);
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeout(3600));
            })
            .catch(err => {
                dispatch(authFail(err));
            })
    }
}

export const authSignup = (username, email, password1, password2) => {
    // alert us that the auth start has taken place
    return dispatch => {
        dispatch(authStart());
        axios.post('/rest-auth/registration/', {
            username: username,
            email: email,
            password1: password1,
            password2: password2
        })
            // see what the response to this post request is
            .then(res => {
                const token = res.data.key;
                // 604800 seconds in a week
                const expirationDate = new Date(new Date().getTime() + 604800 * 1000);
                // need to store this data in a persistant storage
                // (not redux bc when refreshed, the data would be lost)
                localStorage.setItem('token', token);
                localStorage.setItem('expirationDate', expirationDate);
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeout(604800));
            })
            .catch(err => {
                dispatch(authFail(err));
            })
    }
}

export const authCheckState = () => {
    // check if the token is in our local storage
    // if it's not, log out
    // if it is, "update" how much time is left
    return dispatch => {
        const token = localStorage.getItem('token');
        if (token === undefined) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            // if the expiration date is in the past
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
            }
        }
    }
}
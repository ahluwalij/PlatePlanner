import React, { useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';

import SignIn from './containers/SignIn';
import SignUp from './containers/SignUp';
import About from './containers/About';
import HowItWorks from './containers/HowItWorks';
import Home from './containers/Home';
import Saved from './containers/Saved';
import Profile from './containers/Profile';

const BaseRouter = (props) => {
    const history = useHistory();

    useEffect(() => {
        return history.listen((location) => {
            console.log(`You changed the page to: ${location.pathname}`);
        })
    }, [history])

    return (
        <div>
            <Route exact path='/' render={(routeProps) => (<Home {...props} />)} />
            <Route exact path='/howitworks/' render={(routeProps) => (<HowItWorks {...props} />)} />
            <Route exact path='/about/' render={(routeProps) => (<About {...props} />)} />
            <Route exact path='/signin/' render={(routeProps) => (<SignIn {...props} />)} />
            <Route exact path='/signup/' render={(routeProps) => (<SignUp {...props} />)} />
            <Route exact path='/profile/' render={(routeProps) => (<Profile {...props} />)} />
            <Route exact path='/profile/saved/' render={(routeProps) => (<Saved {...props} />)} />
            {/* <Route path='*' render={(routeProps) => (<Home {...props} />)} /> */}
        </div>
    )
};

export default BaseRouter;
import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Input, Checkbox, Form, Button, Alert, message } from 'antd';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';

import logo from '../logo.svg';

// green text: #40a66e

// custom hook
const useDidMountEffect = (func, deps) => {
    const didMount = useRef(false);

    useEffect(() => {
        if (didMount.current) func();
        else didMount.current = true;
    }, deps);
}

const SignIn = (props) => {

    const [signinShake, setSigninShake] = useState(false);
    const [invalidCreds, setInvalidCreds] = useState(false);

    let userRef = React.createRef();
    let passRef = React.createRef();

    const history = useHistory();

    // runs except on initial render
    useDidMountEffect(() => {
        if (props.type === 'AUTH_FAIL') {
            setSigninShake(true);
            setInvalidCreds(true);
            setTimeout(() => {
                setSigninShake(false);
            }, 600)
        }
        if (props.type === 'AUTH_SUCCESS') {
            setInvalidCreds(false);
            history.push('/');
        }
    }, [props.type])

    useEffect(() => {
        userRef.current.focus();
    })

    const onFinish = values => {
        // console.log('Received values of form: ', values);
        props.onAuth(values.username, values.password);
    }

    return (

        <div className='signinPage'>
            <div style={{ height: '120px' }} />
            {props.error && <p>{props.error.message}</p>}

            <Alert className='signinAlert' style={{ opacity: invalidCreds ? 1 : 0 }}
                message={'Username or password is incorrect'}
                type="error" showIcon />

            <div className={['signinBox', signinShake ? 'signinShake' : ''].join(' ')}>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                // onFinishFailed={this.onFinishFailed}
                >
                    {/* padding centers it a little better */}
                    <div style={{ textAlign: 'center', padding: '0 6px 0 0' }}>
                        <Link to='/'>
                            <img src={logo} alt="logo" style={{ width: 32, height: 32, margin: '-20px 0 0 0' }} draggable='false' />
                        </Link>
                        <Link to='/'>
                            <span className='logoText' style={{ padding: '0 0 0 8px' }}>
                                PlatePlan.io
                        </span>
                        </Link>
                    </div>
                    <div className='space32' />

                    <a className='signinTextAbove' onClick={() => userRef.current.focus()}>Username</a>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Input an username' }]}
                    >
                        <Input className='signinField' size='large' ref={userRef} />
                    </Form.Item>
                    <div className='space32' />

                    <a className='signinTextAbove' onClick={() => passRef.current.focus()}>Password</a>
                    <a className='signinForgot' onClick={() => message.info('This feature is not currently supported.  Stay tuned!', 5)}>
                        Forgot your password?
                    </a>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Input a password' }]}
                    >
                        <Input.Password type="password" className='signinField' size='large' ref={passRef} />
                    </Form.Item>
                    <div className='space32' />


                    <Checkbox className='signinCheckbox' defaultChecked={true} onChange={() => console.log('check')}>
                        Stay signed in
                    </Checkbox>
                    <div className='space32' />

                    <Button type='primary' className='signinButton' htmlType="submit" loading={props.loading} >
                        Sign in
                    </Button>
                    <div className='space32' />


                    <div style={{ textAlign: 'center' }}>
                        <span>Don't have an account?</span>
                        <Link to='/signup'>
                            <button className='signinBottomText' onClick={() => console.log('make account')}>
                                &nbsp;&nbsp;Sign up
                            </button>
                        </Link>
                    </div>
                </Form>
            </div>
            <div className='space64' />
            <div className='space64' />
            <div className='signinCopyright'>
                © 2023 Jasdeep Ahluwalia
            </div>
        </div>
    )
}

// required for connect
const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        error: state.error
    }
}

// dispatch because we're calling on onAuth with the username and password
const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, password) => dispatch(actions.authLogin(username, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)

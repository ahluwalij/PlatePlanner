import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Input, Form, Button, Alert } from 'antd';
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

const SignUp = (props) => {

    const [signinShake, setSigninShake] = useState(false);
    const [invalidCreds, setInvalidCreds] = useState(false);
    const [email, setEmail] = useState('');

    let emailRef = React.createRef();
    let userRef = React.createRef();
    let passRef = React.createRef();
    let confirmPassRef = React.createRef();

    const history = useHistory();

    const [form] = Form.useForm();

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
        if (window.location.hash !== '') {
            // setEmail(window.location.hash.substr(1));
            form.setFieldsValue({ email: window.location.hash.substr(1) });
            userRef.current.focus();
        } else {
            emailRef.current.focus();
        }
    }, [])

    const onFinish = values => {
        // console.log('Received values of form: ', values);
        props.onAuth(
            values.username,
            values.email,
            values.password,
            values.confirm);
    }

    const onEmailChange = (e) => {
        form.setFieldsValue({ email: e.target.value });
        return;
    }

    return (
        <div className='signinPage' >
            <div style={{ height: '60px' }} />
            <div className='signinLogo'>
            </div>

            {props.error && <p>{props.error.message}</p>}

            <Alert className='signinAlert' style={{ opacity: invalidCreds ? 1 : 0 }}
                message={'Registration failed.  Most likely, your password is either too common, or it is derived from your username or email.'}
                type="error" showIcon />

            <div className={['signinBox', signinShake ? 'signinShake' : ''].join(' ')}>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    form={form}
                >
                    {/* padding centers it a little better */}
                    <div style={{ textAlign: 'center', padding: '0 6px 0 0' }}>
                        <Link to='/'>
                            <img src={logo} alt="logo" style={{ width: 32, height: 32, margin: '-20px 0 0 0' }} draggable='false' />
                        </Link>
                        <Link to='/'>
                            <span className='logoText' style={{ padding: '0 0 0 8px' }}>
                                PlatePlan
                        </span>
                        </Link>
                    </div>
                    <div className='space20' />

                    <a className='signinTextAbove' onClick={() => emailRef.current.focus()}>Email</a>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Input an email' },
                            { type: 'email', message: 'Enter a valid email' }
                        ]}
                    >
                        <Input className='signinField' size='middle' ref={emailRef} onChange={onEmailChange} />
                    </Form.Item>
                    <div className='space20' />

                    <a className='signinTextAbove' onClick={() => userRef.current.focus()}>Username</a>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Input a username' }]}
                    >
                        <Input className='signinField' size='middle' ref={userRef} />
                    </Form.Item>
                    <div className='space20' />

                    <a className='signinTextAbove' onClick={() => passRef.current.focus()}>Password</a>
                    <Form.Item
                        name="password"
                        rules={[
                            // Django settings:
                            // must be 9 characters
                            // must not be similar to their name, email, etc.
                            // not be a common one
                            // must not be all numeric
                            { required: true, message: 'Input a password' },
                            { min: 9, message: 'Password must be at least 9 characters' },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (/^\d+$/.test(value)) {
                                        return Promise.reject('Password cannot be all numeric');
                                    }
                                    else {
                                        return Promise.resolve();
                                    }
                                },
                            }),
                        ]}
                    >
                        <Input.Password className='signinField' size='middle' ref={passRef} />
                    </Form.Item>
                    <div className='space20' />

                    <a className='signinTextAbove' onClick={() => confirmPassRef.current.focus()}>Confirm password</a>
                    <Form.Item
                        name="confirm"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Confirm your password' },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('The two passwords do not match');
                                },
                            }),
                        ]}
                    >
                        <Input.Password className='signinField' size='middle' ref={confirmPassRef} />
                    </Form.Item>
                    <div className='space20' />

                    <Button type='primary' className='signinButton' htmlType="submit" loading={props.loading} >
                        Create account
                    </Button>
                    <div className='space20' />

                    <div style={{ textAlign: 'center' }}>
                        <span>Have an account?</span>
                        <Link to='/signin'>
                            <button className='signinBottomText' onClick={() => console.log('make account')}>&nbsp;&nbsp;Sign in</button>
                        </Link>
                    </div>
                </Form>
            </div>
            <div className='space64' />
            <div className='space64' />
            <div className='signinCopyright'>
                © 2023 Jasdeep Ahluwalia
            </div>
        </div >
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
        onAuth: (username, email, password1, password2) => dispatch(actions.authSignup(username, email, password1, password2))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)

import React from 'react';

import { Form, Input, Button, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';

import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

class NormalLoginForm extends React.Component {
    onFinish = values => {
        console.log('Received values of form: ', values.type);
        this.props.onAuth(values.username, values.password);
        // navigates us to the home page after logging in
        this.props.history.push('/');
    };

    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    render() {
        // if auth_fail is dispatched
        let errorMessage = null;
        if (this.props.error) {
            errorMessage = (
                <p>this.props.error.message</p>
            );
        }

        return (
            <div>
                {errorMessage}
                {
                    // add the spining animation if it is loading
                    this.props.loading
                        ?
                        <Spin indicator={antIcon} />
                        :
                        <Form
                            name="normal_login"
                            className="login-form"
                            initialValues={{
                                remember: true,
                            }}
                            //onFinish={this.handleSubmit}
                            onFinish={this.onFinish}
                            onFinishFailed={this.onFinishFailed}
                        >
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Please input your Username!' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please input your Password!' }]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Password"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
                                    Login
                                </Button>
                            Or
                            <NavLink style={{ marginRight: '10px' }} to='/signupOld/'
                                > Sign up
                            </NavLink>
                            </Form.Item>
                        </Form>
                }
            </div>
        );
    };
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

export default connect(mapStateToProps, mapDispatchToProps)(NormalLoginForm);
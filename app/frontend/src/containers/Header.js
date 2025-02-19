import React, { useState, useEffect } from 'react';
import { Menu, Dropdown, Spin } from 'antd';
import { Link, withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';

import logo from '../logo.svg';
import { UserOutlined } from '@ant-design/icons';

function Header(props) {
    const [expandHeader, setExpandHeader] = useState(false);
    const [rotateClass, setRotateClass] = useState('logoIcon');
    const [signOutLoading, setSignOutLoading] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(() => {
        const hideDisclaimer = localStorage.getItem("hideDisclaimer");
        return hideDisclaimer !== "true";
    });

    const history = useHistory();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const rotateIcon = () => {
        if (rotateClass === 'logoIconRotate') return;
        setRotateClass('logoIconRotate');
        setTimeout(() => {
            setRotateClass('logoIcon');
        }, 1100);
    };

    const onMenuClick = (event) => {
        if (event.key === '1') {
            history.push('/profile/saved/');
        } else if (event.key === '2') {
            history.push('/profile/');
        } else {
            signout();
        }
    };

    function signout() {
        setSignOutLoading(true);
        setTimeout(() => {
            setSignOutLoading(false);
        }, 500);
        props.logout();
        history.push('/');
    }

    const dismissDisclaimer = () => {
        setShowDisclaimer(false);
        localStorage.setItem("hideDisclaimer", "true");
    };

    return (
        <>
            {/* Fixed Disclaimer Banner */}
            {showDisclaimer && (
                <div 
                    className="disclaimer" 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        zIndex: 1000,
                        backgroundColor: '#ffcccc',
                        color: '#333',
                        padding: '10px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <span>
                        Disclaimer: This site may not fully function properly since I stopped paying for the database but kept a small snapshot.
                    </span>
                    <button 
                        onClick={dismissDisclaimer}
                        style={{
                            border: 'none',
                            padding: '0 0 0 10px',
                            background: 'transparent',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        X
                    </button>
                </div>
            )}

            <div id="topLine" />
            <div className='header' style={{
                height: !expandHeader ? '80px' :
                    (expandHeader && props.isAuthenticated ? '340px' : '250px'),
                    margin: '20px 0 0 0'
            }}>
                <div className='rowHeader'>
                    <div className='headerLRSpace'></div>
                    <div className='logoIcon' style={{ padding: '8px 0 0 0' }}>
                        <button onClick={rotateIcon} style={{ height: '50px', width: '56px' }}>
                            <img className={rotateClass} src={logo} alt="carrot" style={{ width: 35, height: 35, margin: '0 -18px 0px 0' }} draggable='false' />
                        </button>
                    </div>
                    {/* shifted down 15px to center it vertically in the header */}
                    <div className='colHeaderL' style={{ padding: '8px 0 0 0' }}>
                        <Link to='/'>
                            <button className='logoText' style={{ height: '50px', width: '180px' }}
                                onClick={() => { }}>
                                PlatePlanner
                            </button>
                        </Link>
                    </div>

                    <div className='headerCenterLeftSpace'></div>

                    {/* shifted down 10px to center it vertically in the header */}
                    <div className='colHeaderMid' style={{ padding: '15px 0 0 0' }}>
                        <Link to='/howitworks'>
                            <button className="headerText" style={{ height: '50px', width: '135px' }}>
                                How it works
                            </button>
                        </Link>
                        <Link to='/about'>
                            <button className="headerText" style={{ height: '50px', width: '85px' }}>
                                About
                            </button>
                        </Link>
                    </div>

                    <div className='headerCenterRightSpace'></div>

                    {/* shifted down 15px to center it vertically in the header */}
                    <div className='colHeaderR' style={{ padding: '0px 0 0 0' }}>
                        <Spin size='default' spinning={signOutLoading}>
                            {props.isAuthenticated ?
                                <Dropdown className='headerAccountIcon' placement="bottomRight"
                                    overlay={
                                        <Menu onClick={onMenuClick}>
                                            <Menu.ItemGroup title="Account">
                                                <Menu.Item key="1">Saved meals</Menu.Item>
                                                <Menu.Item key="2">Preferences</Menu.Item>
                                                <Menu.Item key="3">
                                                    Sign out →
                                                </Menu.Item>
                                            </Menu.ItemGroup>
                                        </Menu>
                                    }>
                                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                        <UserOutlined style={{ fontSize: '18px' }} />
                                    </a>
                                </Dropdown>
                                :
                                !signOutLoading &&
                                <Link to='/signin'>
                                    <button className="headerText" style={{ height: '50px', width: '110px' }}>
                                        <span id="signInArrow">Sign in</span> <span> →</span>
                                    </button>
                                </Link>}
                        </Spin>
                    </div>

                    {/* shifted down 30px to center it vertically in the header */}
                    <div className='hamburgerMenu' style={{ padding: '30px 25px 0 0', margin: '0 0 0 auto' }}>
                        <button className={
                            expandHeader ? 'hamburger hamburger--slider is-active'
                                : 'hamburger hamburger--slider'
                        }
                            type="button"
                            onClick={e => {
                                setExpandHeader(prev => !prev);
                            }}>
                            <span className="hamburger-box">
                                <span className="hamburger-inner"></span>
                            </span>
                        </button>
                    </div>

                    <div className='headerLRSpace'></div>
                </div>
                <div className='condensedHeader'>
                    <Link to='/howitworks'>
                        <button className='condensedHeaderText'>
                            How it works
                        </button>
                    </Link>
                    <Link to='/about'>
                        <button className='condensedHeaderText'>
                            About
                        </button>
                    </Link>
                    {props.isAuthenticated ?
                        <>
                            <Link to='/profile/saved'>
                                <button className='condensedHeaderText'>
                                    Saved meals
                                </button>
                            </Link>
                            <Link to='/profile'>
                                <button className='condensedHeaderText'>
                                    Preferences
                                </button>
                            </Link>
                            <button className='condensedHeaderText' onClick={signout}>
                                Sign out →
                            </button>
                        </>
                        :
                        <Link to='/signin'>
                            <button className='condensedHeaderText'>
                                Sign in →
                            </button>
                        </Link>
                    }
                </div>
            </div>

            <div className='headerBorder' />
        </>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout())
    };
};

export default withRouter(connect(null, mapDispatchToProps)(Header));

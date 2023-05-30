import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    GithubOutlined, LinkedinFilled,
    MailOutlined, CheckCircleOutlined
} from '@ant-design/icons';

import FeedbackModal from '../components/FeedbackModal';

import whiteLogo from '../whiteLogo.svg';

function copyToClipboard(text) {
    // from good ol' stack overflow
    var dummy = document.createElement("textarea");
    // to avoid breaking origin page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea".
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

function Footer(props) {

    const [displayEmail, setDisplayEmail] = useState(false);
    const [showModal, setShowModal] = useState(false)

    function closeModal() {
        setShowModal(false);
    }

    return (
        <>
            <FeedbackModal visible={showModal} closeModal={closeModal} />
            <div className='footer'>
                <div className='footerBody'>
                    <div style={{ display: 'flex' }}>
                        <img src={whiteLogo} alt="logo" style={{ width: 32, height: 32, margin: '-5px 0 0 0' }} draggable='false' />
                        <span className='logoText' style={{ color: '#fff', padding: '0 0 0 8px' }}>
                            PlatePlanner
                    </span>
                    </div>

                    <div className='footerLinks'>
                        <Link to='/'>
                            Home
                        </Link>
                        <Link to='/howitworks'>
                            How it works
                        </Link>
                        <Link to='/about'>
                            About
                        </Link>
                        <a onClick={() => setShowModal(true)}>
                            Feedback
                        </a>
                        <a href='https://github.com/ahluwalij/plateplanner-meal-generator'>
                            Source code
                        </a>
                    </div>
                    <div className='footerSocials'>
                        <a href='https://github.com/ahluwalij'>
                            <GithubOutlined style={{ fontSize: '26px' }} />
                        </a>
                        <a href='https://www.linkedin.com/in/jasdeep-ahluwalia'>
                            <LinkedinFilled style={{ fontSize: '26px' }} />
                        </a>
                        <span className='footerEmail' onClick={() => setDisplayEmail(!displayEmail)}>
                            <MailOutlined style={{ fontSize: '26px' }} />
                        </span>
                    </div>
                    {displayEmail &&
                        <div className='footerEmailText' >
                            {copyToClipboard('jasdeep.a@outlook.com')}
                            <CheckCircleOutlined />&nbsp; Copied to clipboard
                        <div className='space8' />
                        jasdeep.a@outlook.com
                    </div>
                    }
                    <div className='footerCopyright'>
                        <span onClick={() => localStorage.clear()}>
                            ©
                        </span>
                        {' '}2023 Jasdeep Ahluwalia
                    </div>
                </div>
            </div >
        </>
    )
}

export default Footer;

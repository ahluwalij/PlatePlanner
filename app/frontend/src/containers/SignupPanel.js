import React, { useState } from 'react';
import { Input } from 'antd';
import { useHistory } from 'react-router-dom';

function SignupPanel(props) {

    const [email, setEmail] = useState('');

    const history = useHistory();

    return (
        <div className='signupPanel'>
            <div className='signupPanelBody'>
                <div className='signupPanelFillerLR' />
                <div className='signupPanelReadyText'>
                    <div style={{ color: '#40a66e' }}>
                        Ready to get your diet on track?
                        {/* It tasts better when it's effortless. */}
                        {/* It does everything but make the sandwich. */}
                    </div>
                    Join Plate Planner today.
                </div>
                <div className='signupPanelFillerM' />
                <div className='signupPanelInput'>
                    <Input className='signupPanelEmail' placeholder='Email' size='large'
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                    <a className={['genButton', 'signupPanelInputButton'].join(' ')}
                        onClick={() => {
                            history.push(`/signup#${email}`);
                        }}>
                        SIGN UP
                    </a>
                    <div className='signupPanelInputFiller' />
                </div>
                <div className='signupPanelFillerLR' />
            </div>
        </div>
    )
}

export default SignupPanel;

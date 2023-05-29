import React, { useState } from 'react';
import {
    Modal, Input, Spin, message
} from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FeedbackModal = (props) => {

    const [name, setName] = useState('');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);

    function sendFeedback() {
        setLoading(true);
        axios.post('https://meal-maker-feedback.firebaseio.com/.json', {
            name: name,
            feedback: feedback
        })
            .then(res => {
                console.log(res);
                setLoading(false);
                props.closeModal();
                message.success('Feedback submitted. Thanks :)', 4);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
                props.closeModal();
                message.error('Error occured trying to send feedback, try again.', 4);
            })
    }

    return (
        <Modal
            title='Feedback'
            visible={props.visible}
            onCancel={props.closeModal}
            footer={null}
            width='550px'
            bodyStyle={{}}
        >
            <Spin spinning={loading}>
                <div className='feedbackModal'>
                    <p>
                        Let me know your thoughts about the site! Also, feel free to report bugs,
                        or share new features I should add.
                    </p>
                    <p>
                        If you haven't already, check out the&nbsp;
                        <Link to='/howitworks'>
                            <a>How it works</a>
                        </Link>
                        &nbsp;page for a list of features I plan on adding in the future.
                    </p>
                    <div style={{ width: '100%', borderBottom: '1px solid #eeeeee' }} />
                    <div className='space16' />

                    <div className='feedbackModalLabel'>
                        Name (optional)
                    </div>
                    <Input className='feedbackModalNameInput' value={name} onChange={e => setName(e.target.value)} />
                    <div className='space12' />

                    <div className='feedbackModalLabel'>
                        Message
                    </div>
                    <Input.TextArea value={feedback} onChange={e => setFeedback(e.target.value)}>
                    </Input.TextArea>
                    <div className='space20' />

                    <a className='genButton' onClick={sendFeedback}>
                        Submit
                    </a>
                </div>
            </Spin>
        </Modal >
    );
}

export default FeedbackModal;
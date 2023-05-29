import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import {
    message
} from 'antd';

import Header from './Header';
import Footer from './Footer';
import CalorieCalcModal from '../components/CalorieCalcModal';


function Profile(props) {

    const [userData, setUserData] = useState({ username: '', email: '' });
    const [numMeals, setNumMeals] = useState(0);
    const [showCalcModal, setShowCalcModal] = useState(false);
    const [calories, setCalories] = useState(2000);

    const history = useHistory();

    // Redirect the user back to the home page if they aren't logged in
    useEffect(() => {
        if (!props.isAuthenticated)
            history.push('/');
        else if (props.isAuthenticated) {
            axios.get('/rest-auth/user/', {
                headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
            })
                .then(res => {
                    setUserData(res.data);
                })
                .catch(error => {
                    console.log(error);
                })
        }
        axios.get('/api/', {
            headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
        })
            .then(res => {
                setNumMeals(res.data.length);
            })
            .catch(error => {
                console.log(error);
            })

        const s_calories = localStorage.getItem('profileCalories');
        if (s_calories) setCalories(s_calories);
    }, [])

    function closeCalcModal() {
        setShowCalcModal(false);
    }

    function changeCalories(cals) {
        setCalories(cals);
        // temporarily stored in local storage, need to store in its own model on the database!! 
        console.log(String(cals));
        localStorage.setItem('profileCalories', String(cals));
    }

    return (
        <>
            <CalorieCalcModal visible={showCalcModal} closeModal={closeCalcModal}
                onCalorieChange={changeCalories} gotoMainTab={null} />
            <Header {...props} />
            <div className='profile'>
                <div className='profileBody'>
                    <h3>
                        Welcome back, {userData.username}
                    </h3>
                    <div>
                        You have {numMeals} meals saved.&nbsp;&nbsp;
                        <Link to={numMeals !== 0 ? '/profile/saved' : '/'}>
                            <a className='profileGreyLinks'>
                                {numMeals !== 0 ?
                                    '- View'
                                    :
                                    '- Get started'
                                }
                            </a>
                        </Link>
                    </div>
                    <div className='space6' />
                    <div>
                        Your daily caloric need is about {calories} calories.&nbsp;&nbsp;
                        <a className='profileGreyLinks' onClick={() => setShowCalcModal(true)}>
                            - Change
                        </a>
                    </div>
                    <div style={{ height: '100px' }} />
                    <h3>
                        Settings
                    </h3>
                    <div>
                        Username:&nbsp; {userData.username}&nbsp;&nbsp;
                        <a className='profileGreyLinks' onClick={() => message.info('This feature is not currently supported.  Stay tuned!', 5)}>
                            - Change
                        </a>
                        <div className='space6' />
                        Email:&nbsp; {userData.email}&nbsp;&nbsp;
                        <a className='profileGreyLinks' onClick={() => message.info('This feature is not currently supported.  Stay tuned!', 5)}>
                            - Change
                        </a>
                    </div>

                </div>
            </div>
            <div style={{ height: '400px' }} />
            <Footer />
        </>
    )
}


export default Profile;
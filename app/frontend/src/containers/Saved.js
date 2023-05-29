import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Input } from 'antd';

import Header from './Header';
import Footer from './Footer';
import Foods from '../components/Food';

const { Search } = Input;


function Saved(props) {

    // all the saved meals from the user --- [id, meal JSON]
    const [allFoods, setAllFoods] = useState([]);
    // the current meals from the search box --- [id, meal JSON]
    const [foods, setFoods] = useState([]);

    const history = useHistory();

    // Redirect the user back to the home page if they aren't logged in
    useEffect(() => {
        if (!props.isAuthenticated) {
            history.push('/');
            return;
        }
        axios.get('/api/', {
            headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
        })
            .then(res => {
                const parsedFoods = res.data.map(elem => {
                    // converts to format '2020-06-07'
                    const rawDate = elem.date.split('T')[0];
                    // converts to format ['2020', '06', '07'];
                    const splitDate = rawDate.split('-');
                    // converts to format ['2020', '6', '7'];
                    const newSplitDate = splitDate.map(elem => elem.replace(/^0+/, ''));
                    // converts to format 6/7/2020 
                    const newDate = newSplitDate[1] + '/' + newSplitDate[2] + '/' + newSplitDate[0];
                    return [elem.id, JSON.parse(elem.meal), newDate];
                })
                setAllFoods(parsedFoods);
                setFoods(parsedFoods);
            })
            .catch(error => {
                console.log(error);
            })
    }, [])

    function onChangeSearch(e) {
        // removes whitespace at the end of a search
        const query = e.target.value.replace(/\s*$/, "");
        // true to keep element, false to remove it
        const newFoods = allFoods.filter(elem => {
            const name = elem[1].name;
            if (!query)
                return true;
            else
                return (name.toLowerCase().includes(query.toLowerCase()));
        })
        setFoods(newFoods);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Header {...props} />
            <div className='savedMeals' style={{ display: 'flex', justifyContent: 'center' }}>
                <div className='savedMealsBody'>
                    <div style={{ display: 'flex', fontSize: '24px', padding: '0 24px', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            Saved meals
                        </div>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                            <Search className='savedMealsSearchBar' placeholder="Search meals"
                                onSearch={value => console.log('searched ' + value)}
                                onChange={onChangeSearch} />
                        </div>
                    </div>
                    <div className='space8' />
                    <Foods data={foods} />
                </div>
            </div>
            <Footer />
        </div>
    )
}


export default Saved;
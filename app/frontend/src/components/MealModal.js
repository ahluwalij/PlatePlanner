import React, { useState, useEffect } from 'react';
import {
    Modal, Steps, message
} from 'antd';
import {
    SyncOutlined, HeartOutlined, HeartTwoTone,
    PushpinOutlined, PushpinFilled
} from '@ant-design/icons';
import axios from 'axios';

import FoodIcon from './FoodIcon';

import { Pie, defaults } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

defaults.global.legend.display = false;

const pieOptions = {
    plugins: {
        datalabels: {
            formatter: (value, context) => {
                return (value === 0) ? '' : ['C', 'P', 'F'][context.dataIndex];
            },
            color: 'white',
            font: {
                family: 'Alliance',
                size: 13
            }
        }
    },
    elements: {
        arc: {
            borderWidth: 1
        }
    },
    tooltips: {
        callbacks: {
            label: (tooltipItem, data) => {
                return data['labels'][tooltipItem['index']] + ': ' +
                    data['datasets'][0]['data'][tooltipItem['index']] + '%';
            }
        }
    },
    maintainAspectRatio: false,
    responsive: false,

}

const pieColors = {
    backgroundColor: [
        '#5B8FF9',
        '#E8684A',
        '#47B57A',
        // '#5D7092',
    ],
    hoverBackgroundColor: [
        '#4972D8',
        '#C7533B',
        '#399662',
        // '#4A5A7B'
    ],
}

const { Step } = Steps;

const MealModal = (props) => {

    const [favorite, setFavorite] = useState(false);
    // Only used to display heart icon, saved meals are actaully stored on the database
    // in the format: [id, name]
    const [sessionFavoriteID, setSessionFavoriteID] = useState(null);

    // remove the heart icon on a new meal or the user is signed out
    useEffect(() => {
        setFavorite(false);
        setSessionFavoriteID(null);
    }, [props.meal, props.isAuthenticated]);

    function onClickHeart() {
        if (!props.isAuthenticated) {
            message.warning('Make an account to save your favorite meals', 4);
        } else {
            if (favorite)
                removeFood();
            else
                saveFood();
        }
    }

    async function saveFood() {
        return axios.post('/api/', {
            created_by: props.username,
            meal: JSON.stringify(props.meal)
        })
            .then(res => {
                setFavorite(true);
                setSessionFavoriteID(res.data.id);
                message.success('Meal saved to favorites', 3);
            })
            .catch(error => {
                message.error('Something went wrong with the saving :(');
                console.log(error);
            })

    }

    async function removeFood() {
        if (!sessionFavoriteID) {
            message.error('Something went wrong with the removal :(');
            return;
        }
        axios.delete(`/api/${sessionFavoriteID}/`, {
            headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
        })
            .then(res => {
                setFavorite(false);
                message.success('Meal removed from favorites', 3);
            })
            .catch(error => {
                message.error('Something went wrong with the removal :(');
                console.log(error);
            })
    }

    function handleCancel() {
        props.closeModal();
    }

    function regen(e) {
        // send in a true parameter so it doesn't run the e.stopPropagation();
        props.regen(e, true);
    }

    function pin(e) {
        props.pin(e, true);
    }

    return (
        <Modal
            className='mealModal'
            title={
                <>
                    <b style={{ fontWeight: 500, fontSize: '17px' }}>{props.meal.name}</b>
                    <br />
                    <br />
                    <div className='rowMM'>
                        <div className='colMMIcon'>
                            <div style={{ width: '100px' }}>
                                <FoodIcon name={props.meal.name} />
                            </div>
                            <div style={{ width: '120px', textAlign: 'left', margin: '0 0 0 30px', fontSize: '15px' }}>
                                <p> {'Prep: '}
                                    <span style={{ float: 'right' }}>
                                        {typeof props.meal.prepTime === 'undefined' ? 'n/a'
                                            : props.meal.prepTime + ' min'}
                                    </span>
                                </p>
                                <p> {'Cook: '}
                                    <span style={{ float: 'right' }}>
                                        {typeof props.meal.cookTime === 'undefined' ? 'n/a'
                                            : props.meal.cookTime + ' min'}
                                    </span>
                                </p>
                                {props.useIcons && <span style={{ fontSize: '18px' }}>
                                    {/* make regen icon invisible (if it's pinned)
                                     so it doesnt disappear and shift all the other icons */}
                                    {!props.pinned ?
                                        (props.loading ?
                                            <SyncOutlined className='regenIcon' spin onClick={(e) => regen(e)} /> :
                                            <SyncOutlined className='regenIcon' onClick={(e) => regen(e)} />)
                                        :
                                        <SyncOutlined className='regenIcon' style={{ opacity: 0 }} />}
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    {props.pinned ?
                                        <PushpinFilled className='pinIcon' onClick={(e) => pin(e, true)} /> :
                                        <PushpinOutlined className='pinIcon' onClick={(e) => pin(e, true)} />}
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    {favorite ?
                                        <HeartTwoTone className='heartIconFilled' twoToneColor='#eb2f96' onClick={onClickHeart} />
                                        :
                                        <HeartOutlined className='heartIconOutline' onClick={onClickHeart} />
                                    }

                                </span>}
                            </div>
                        </div>
                        <div className='colMMFiller' />
                        <div className='colMMPie'>
                            <div style={{ width: '110px' }}>
                                <Pie
                                    width={110}
                                    height={110}
                                    borderWidth={5}
                                    data={{
                                        labels: ['Carbs', 'Protein', 'Fat'],
                                        datasets:
                                            [{
                                                ...pieColors,
                                                data:
                                                    [Math.floor(props.meal.carbs * 100 / (props.meal.carbs + props.meal.protein + props.meal.fat * (9 / 4))),
                                                    Math.floor(props.meal.protein * 100 / (props.meal.carbs + props.meal.protein + props.meal.fat * (9 / 4))),
                                                    Math.floor((props.meal.fat * (9 / 4) * 100) / (props.meal.carbs + props.meal.protein + props.meal.fat * (9 / 4)))]
                                            }]
                                    }}
                                    options={pieOptions}
                                />
                            </div>
                            <div style={{ width: '145px', textAlign: 'left', margin: '0 0 0 35px', fontSize: '15px' }}>
                                <span>{'Calories: '}
                                    <span style={{ float: 'right' }}>{props.meal.calories}</span>
                                </span>
                                <div className='space6' />
                                <div style={{ width: '25px', borderBottom: '2px solid #a0a0a0' }} />
                                <div className='space8' />
                                <span> {'Carbs: '}
                                    <span style={{ float: 'right' }}>{props.meal.carbs}{'g'}</span>
                                </span>
                                <div className='space6' />
                                <span> {'Protein: '}
                                    <span style={{ float: 'right' }}>{props.meal.protein}{'g'}</span>
                                </span>
                                <div className='space6' />
                                <span> {'Fat: '}
                                    <span style={{ float: 'right' }}>{props.meal.fat}{'g'}</span>
                                </span>
                            </div>
                        </div>
                        <div className='colMMFiller' />
                    </div>
                </>
            }
            visible={props.visible}
            onCancel={handleCancel}
            footer={null}
            width='700px'
            bodyStyle={{}}
        >
            <b style={{ fontSize: '16px', fontWeight: 400, color: '#383a3c' }}>
                Ingredients (makes {props.meal.makes} {props.meal.makes === 1 ? 'serving' : 'servings'}):
            </b>
            <div className='space4' />
            {/* need to add keys to help React identify changes */}
            <ul className='mealModalIngredients'>
                {props.meal.ingredients.map((elem, idx) =>
                    <li style={{ fontSize: '15px' }} key={idx}>{elem}</li>
                )}
            </ul>
            <br />
            <b style={{ fontSize: '16px', fontWeight: 400, color: '#383a3c' }}>Instructions:</b>
            <div className='space8' />
            <Steps direction='vertical' size='small' current={-1} >
                {props.meal.instructions.map((elem, idx) =>
                    <Step description={elem} key={idx} />
                )}
            </Steps>
        </Modal >
    );
}

export default MealModal;

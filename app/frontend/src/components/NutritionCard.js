import React, { useState } from 'react';

import { Collapse } from 'antd';
import { Pie, defaults } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

import {
    SyncOutlined
} from '@ant-design/icons';

const pieOptions = {
    plugins: {
        datalabels: {
            formatter: (value, context) => {
                return (value === 0) ? '' : ['C', 'P', 'F'][context.dataIndex];
            },
            color: 'white',
            font: {
                family: 'Camphor',
                size: 16
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

const smallPieOptions = {
    maintainAspectRatio: false,
    responsive: false,
    tooltips: { enabled: false },
    hover: { mode: null },
    plugins: {
        datalabels: { display: false }
    },
    elements: {
        arc: { borderWidth: 1 }
    },
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

defaults.global.legend.display = false;

const { Panel } = Collapse;
const mainTextColor = '#32323c';

const NutritionCard = (props) => {

    const [totalHeight, setTotalHeight] = useState(89);

    return (
        <div className='nutritionCardToggle' style={{ height: props.calories === 0 ? 0 : totalHeight, opacity: props.calories === 0 ? 0 : 1 }}>
            <div className='nutritionCardHeader'>
                Today's Meal Plan
                {/* originally hid the regen icon if the preferences have changed, but it was buggy so always show it */}
                <span className='nutritionCardHeaderRegen' onClick={() => props.onClickGenerateButton(true)}>
                    {props.otherRegenLoadingMeals ? <SyncOutlined spin /> : <SyncOutlined />}&nbsp;
                        Regenerate
                </span>
            </div>
            <div className='space8' />
            <div className='nutritionCard'>
                {/* simply set the height to auto once it's clicked so ant's collapse dropdown animation will start */}
                <Collapse expandIconPosition='right' onChange={() => setTotalHeight('auto')}>
                    <Panel header={
                        <div style={{ display: 'flex' }}>
                            <Pie
                                width={30}
                                height={30}
                                data={{
                                    datasets: [{
                                        ...pieColors,
                                        data: [Math.round(props.carbs * 100 / (props.carbs + props.protein + props.fat * (9 / 4))),
                                        Math.round(props.protein * 100 / (props.carbs + props.protein + props.fat * (9 / 4))),
                                        Math.round((props.fat * (9 / 4) * 100) / (props.carbs + props.protein + props.fat * (9 / 4)))]
                                    }]
                                }}
                                options={smallPieOptions}
                            />
                                &nbsp;&nbsp;&nbsp;
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                {props.calories} calories
                                </div>
                        </div>} key="1">
                        <div className='nutritionCardBody'>
                            <div className='nutritionPieBody'>
                                <Pie
                                    width={150}
                                    height={150}
                                    data={{
                                        labels: ['Carbs', 'Protein', 'Fat'],
                                        datasets:
                                            [{
                                                ...pieColors,
                                                data: [Math.round(props.carbs * 100 / (props.carbs + props.protein + props.fat * (9 / 4))),
                                                Math.round(props.protein * 100 / (props.carbs + props.protein + props.fat * (9 / 4))),
                                                Math.round((props.fat * (9 / 4) * 100) / (props.carbs + props.protein + props.fat * (9 / 4)))]
                                            }]
                                    }}
                                    options={pieOptions}
                                />
                            </div>
                            <div className='nutritionFacts'>
                                <span>{'Calories: '}
                                    <span style={{ float: 'right' }}>{props.calories}</span>
                                </span>
                                <div className='space6' />
                                <div style={{ width: '25px', borderBottom: '2px solid #a0a0a0' }} />
                                <div className='space8' />
                                <span> {'Carbs: '}
                                    <span style={{ float: 'right' }}>{props.carbs}{'g'}</span>
                                </span>
                                <div className='space6' />
                                <span> {'Protein: '}
                                    <span style={{ float: 'right' }}>{props.protein}{'g'}</span>
                                </span>
                                <div className='space6' />
                                <span> {'Fat: '}
                                    <span style={{ float: 'right' }}>{props.fat}{'g'}</span>
                                </span>
                            </div>
                        </div>
                    </Panel>
                </Collapse>
            </div >
        </div >
    )
}

export default NutritionCard;
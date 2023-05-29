import React, { useState } from 'react';
import {
    Tabs, Select, Switch, List, Modal
} from 'antd';
import {
    SyncOutlined, SettingFilled, SlidersFilled, CalculatorFilled, InfoCircleOutlined
} from '@ant-design/icons';
import NumberFormat from 'react-number-format';
import Sliders from './Sliders';
import CalorieCalcModal from '../components/CalorieCalcModal';

const mainTextColor = '#32323c';

const { Option } = Select;
const { TabPane } = Tabs;

const InputBox = (props) => {

    const [tabPos, setTabPos] = useState('1');
    const [showCalcModal, setShowCalcModal] = useState(false);

    function closeCalcModal() {
        setShowCalcModal(false);
    }

    function gotoMainTab() {
        setTabPos('1');
    }

    function onChangeMeals(value) {
        props.setNumMeals(parseInt(value));
        props.setChangedPrefs(true);
    }

    return (
        <>
            <CalorieCalcModal visible={showCalcModal} closeModal={closeCalcModal}
                onCalorieChange={props.onCalorieChange} gotoMainTab={gotoMainTab} />
            <div className='inputBox' id={props.inputBoxShake ? 'inputBoxShake' : ''}>
                <Tabs activeKey={tabPos}>
                    <TabPane tab='Tab 1' key='1'>
                        <div className='inputMain'>
                            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ textAlign: 'right', position: 'relative' }}>
                                    <span className="inputMainBody" >
                                        I want to eat &nbsp;
                                        <NumberFormat
                                            className={['ant-input', 'inputMainCalInput', props.validInput ? '' : 'inputInvalid'].join(' ')}
                                            suffix={' calories'} defaultValue={2000} allowEmptyFormatting={true}
                                            onValueChange={props.onCalorieChange} value={props.calories}
                                        />
                                    </span>
                                    <div className='space20' />
                                    <span className="inputMainBody">
                                        in &nbsp;
                                        <Select className='inputMainMealSelect' defaultValue="3" size='large'
                                            onChange={onChangeMeals} value={String(props.numMeals)} >
                                            <Option value='1'>1 meal</Option>
                                            <Option value='2'>2 meals</Option>
                                            <Option value='3'>3 meals</Option>
                                            <Option value='4'>4 meals</Option>
                                            <Option value='5'>5 meals</Option>
                                            <Option value='6'>6 meals</Option>
                                        </Select>
                                    </span>
                                    <div className='space20' />
                                    <div className='inputButtonRow'>
                                        <a className='genButton' onClick={() => setTabPos('2')}
                                            style={{ backgroundColor: '#FFF' }}>
                                            <SettingFilled style={{ color: '#808080' }} />
                                        </a>

                                        <a className='genButton' onClick={() => setTabPos('3')}
                                            style={{ backgroundColor: '#FFF', fontSize: '18px' }}>
                                            <SlidersFilled style={{ color: '#5ca9f8' }} />
                                        </a>

                                        {/* GENERATE BUTTON */}
                                        <a className='genButton' onClick={() => props.onClickGenerateButton(false)}>
                                            {props.loadingMeals ? <SyncOutlined spin /> : <SyncOutlined />}&nbsp;
                                            GENERATE
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className='inputBorder' />

                            <Sliders macros={props.macros} macroPinned={props.macroPinned} calories={props.calories}
                                pinMacro={props.pinMacro} carbSlider={props.carbSlider} proteinSlider={props.proteinSlider}
                                fatSlider={props.fatSlider} enableMacros={props.enableMacros} />

                        </div>
                    </TabPane>
                    <TabPane tab='Tab 2' key='2'>
                        <div className='inputSettings'>
                            <a className='inputBack' onClick={() => setTabPos('1')}>
                                <span className='inputBackArrow'>← </span>
                                <span className='inputBackText'>Back</span>
                            </a>
                            <List className='inputSettingsList'>
                                <List.Item>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        Macro preferences&nbsp;&nbsp;
                                    <Switch checked={props.enableMacros} onChange={props.macroSwitch} />
                                    </div>
                                </List.Item>
                                <List.Item>
                                    Time per meal&nbsp;&nbsp;
                                    <Select className='inputSelect'
                                        defaultValue='2' value={'< ' + String(props.availableTime - 1) + ' min'}
                                        onChange={(value) => {
                                            if (value === '1')
                                                props.setAvailableTime(16);
                                            else if (value === '2')
                                                props.setAvailableTime(31);
                                            else
                                                props.setAvailableTime(46);
                                            props.setChangedPrefs(true);
                                        }}>
                                        <Option value='1'>&lt; 15 min</Option>
                                        <Option value='2'>&lt; 30 min</Option>
                                        <Option value='3'>&lt; 45 min</Option>
                                    </Select>
                                </List.Item>
                                <List.Item>
                                    <div className='inputSettingsCalc' onClick={() => setShowCalcModal(true)}>
                                        Calorie calculator&nbsp;&nbsp;
                                        <CalculatorFilled className='inputSettingsCalcIcon' />
                                    </div>
                                </List.Item>
                            </List>
                        </div>
                    </TabPane>
                    {/* For the macro sliders when the screen width is too narrow */}
                    <TabPane tab='Tab 3' key='3'>
                        <div className='macroTab'>
                            <a className='inputBack' onClick={() => setTabPos('1')}>
                                <span className='inputBackArrow'>← </span>
                                <span className='inputBackText'>Back</span>
                            </a>
                            {/* make hight bigger than actual height (220px) so it gets vertically alligned lower */}
                            <div style={{ height: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Sliders macros={props.macros} macroPinned={props.macroPinned} calories={props.calories}
                                    pinMacro={props.pinMacro} carbSlider={props.carbSlider} proteinSlider={props.proteinSlider}
                                    fatSlider={props.fatSlider} enableMacros={props.enableMacros} />
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </>
    )
}

export default InputBox;
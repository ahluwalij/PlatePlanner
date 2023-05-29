import React from 'react';
import {
    Slider
} from 'antd';
import {
    PushpinOutlined, PushpinFilled
} from '@ant-design/icons';

// used to render the pin icon on the sliders (not exported)
const PinIcon = (props) => {
    return (
        <>
            {/* if the macros are enabled -> 
                if nothing is pinned then return an outlined pin
                else
                    if that macro is pinnned then return a filled in pin */}
            {props.enableMacros &&
                (
                    props.macroPinned === null ?
                        <PushpinOutlined className='macroPin' onClick={() => props.pinMacro(props.num)} /> :
                        (props.macroPinned === props.num ?
                            <PushpinFilled className='macroPin' onClick={() => props.pinMacro(props.num)} /> :
                            null)
                )
            }
        </>
    );
}

const Sliders = (props) => {

    return (
        <div className='inputMacroSlider'>
            <div style={{ width: '220px' }}>
                {/* Carbs */}
                <span className='macroSliderText' style={{ float: 'left' }}>
                    Carbs &nbsp;
                    <PinIcon num={1} macroPinned={props.macroPinned}
                        pinMacro={props.pinMacro} enableMacros={props.enableMacros} />
                </span>
                <span className='macroSliderText' style={{ float: 'right' }}>
                    {props.enableMacros ?
                        Math.round(props.macros.carbs) + ' g'
                        :
                        'n/a'
                    }
                </span>
                <br />
                <Slider defaultValue={45} tipFormatter={val => `${val}%`} min={props.enableMacros ? 15 : 0} max={70}
                    value={props.enableMacros ? Math.round((props.macros.carbs * 4) / (props.calories / 100)) : 0}
                    disabled={props.macroPinned === 1 || !props.enableMacros}
                    onChange={(percent) => props.carbSlider(percent)}
                />
                {/* Protein */}
                <span className='macroSliderText' style={{ float: 'left' }}>
                    Protein &nbsp;
                    <PinIcon num={2} macroPinned={props.macroPinned}
                        pinMacro={props.pinMacro} enableMacros={props.enableMacros} />
                </span>
                <span className='macroSliderText' style={{ float: 'right' }}>
                    {props.enableMacros ?
                        Math.round(props.macros.protein) + ' g'
                        :
                        'n/a'
                    }
                </span>
                <br />
                <Slider defaultValue={30} tipFormatter={val => `${val}%`} min={props.enableMacros ? 15 : 0} max={70}
                    value={props.enableMacros ? Math.round((props.macros.protein * 4) / (props.calories / 100)) : 0}
                    disabled={props.macroPinned === 2 || !props.enableMacros}
                    onChange={(percent) => props.proteinSlider(percent)}
                />
                {/* Fat */}
                <span className='macroSliderText' style={{ float: 'left' }}>
                    Fat &nbsp;
                    <PinIcon num={3} macroPinned={props.macroPinned}
                        pinMacro={props.pinMacro} enableMacros={props.enableMacros} />
                </span>
                <span className='macroSliderText' style={{ float: 'right' }}>
                    {props.enableMacros ?
                        Math.round(props.macros.fat) + ' g'
                        :
                        'n/a'
                    }
                </span>
                <br />
                <Slider defaultValue={25} tipFormatter={val => `${val}%`} min={props.enableMacros ? 15 : 0} max={70}
                    value={props.enableMacros ? Math.round((props.macros.fat * 9) / (props.calories / 100)) : 0}
                    disabled={props.macroPinned === 3 || !props.enableMacros}
                    onChange={(percent) => props.fatSlider(percent)}
                />
            </div>
        </div>
    )
}

export default Sliders;
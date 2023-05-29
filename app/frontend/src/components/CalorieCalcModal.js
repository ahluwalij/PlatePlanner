import React, { useState } from 'react';
import {
    Modal, Input, Radio, Select
} from 'antd';
import {
    CalculatorFilled, CheckOutlined
} from '@ant-design/icons';

const { Option } = Select;


const CalorieCalcModal = (props) => {

    const [goal, setGoal] = useState('b');
    const [gender, setGender] = useState('');
    const [feet, setFeet] = useState('');
    const [inches, setInches] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [activity, setActivity] = useState('a');

    const [validGender, setValidGender] = useState(true);
    const [validFeet, setValidFeet] = useState(true);
    const [validInches, setValidInches] = useState(true);
    const [validAge, setValidAge] = useState(true);
    const [validWeight, setValidWeight] = useState(true);

    const [buttonShake, setButtonShake] = useState(false);
    const [calories, setCalories] = useState(0);

    function handleCancel() {
        props.closeModal();
    }

    function apply() {
        props.onCalorieChange(calories);
        if (props.gotoMainTab) // false if it's called from the profile
            props.gotoMainTab();
        handleCancel();
    }

    function calculate() {
        let valid = true;
        if (!gender) {
            setValidGender(false);
            valid = false;
        }
        else
            setValidGender(true);

        if (!feet || feet < 1 || feet > 8) {
            setValidFeet(false);
            valid = false;
        }
        else
            setValidFeet(true);

        if (!inches || inches < 0 || inches > 12) {
            setValidInches(false);
            valid = false;
        }
        else
            setValidInches(true);

        if (!age || age < 1 || age > 122) {
            setValidAge(false);
            valid = false;
        }
        else
            setValidAge(true);

        if (!weight || weight < 1 || weight > 1000) {
            setValidWeight(false);
            valid = false;
        }
        else
            setValidWeight(true);

        if (!valid) {
            setButtonShake(true);
            setTimeout(() => {
                setButtonShake(false);
            }, 600)
        }
        // IF VALID
        else {
            setButtonShake(false);
            // metric
            // male: BMR = 88.362 + (13.397 × weight in kg) + (4.799 × height in cm) - (5.677 × age in years)
            // female: BMR = 447.593 + (9.247 × weight in kg) + (3.098 × height in cm) - (4.330 × age in years)

            // imperial
            // male: BMR = 88.362 + (6.077 × weight in lbs) + (12.189 × height in in) - (5.677 × age in years)
            // female: BMR = 447.593 + (4.194 × weight in lbs) + (7.869 × height in in) - (4.330 × age in years)
            let cals = 0;
            if (gender === 'a')
                cals = 88.362 + (6.077 * weight) + (12.189 * (feet * 12 + inches)) - (5.677 * age);
            else
                cals = 447.593 + (4.194 * weight) + (7.869 * (feet * 12 + inches)) - (4.330 * age);

            if (activity === 'a')
                cals *= 1.2;
            else if (activity === 'b')
                cals *= 1.35;
            else if (activity === 'c')
                cals *= 1.5;
            else if (activity === 'd')
                cals *= 1.7;
            else
                cals *= 1.9;

            if (goal === 'a')
                cals = cals * 0.85
            else if (goal === 'c')
                cals = cals * 1.15
            cals = Math.round(cals);
            setCalories(cals);
        }

    }

    return (
        <Modal
            className='calorieCalcModal'
            title={'Calorie Calculator'}
            visible={props.visible}
            onCancel={handleCancel}
            footer={null}
            width='600px'
            bodyStyle={{}}
        >
            <p>
                This calculator estimates your TDEE (Total Daily Energy Expenditure),
                or the number of calories you need to burn each day in order to maintain your current weight.
            </p>
            <div style={{ width: '100%', borderBottom: '1px solid #eeeeee' }} />
            <div className='space24' />

            <div className={['calorieCalcRow', 'calorieCalcGoal'].join(' ')}>
                <div className='calorieCalcFieldText' >I want to</div>
                <Radio.Group className='calorieCalcRadioSmall' size='large' buttonStyle="solid" defaultValue='b'
                    onChange={(e) => setGoal(e.target.value)}>
                    <Radio.Button value="a">Lose Weight</Radio.Button>
                    <Radio.Button value="b">Maintain</Radio.Button>
                    <Radio.Button value="c">Build Muscle</Radio.Button>
                </Radio.Group>
            </div>
            <div className={['calorieCalcRow', 'calorieCalcGender'].join(' ')}>
                <div className='calorieCalcFieldText'>Gender</div>
                <Radio.Group className={['calorieCalcRadioSmall', validGender ? '' : 'inputInvalid'].join(' ')}
                    size='large' buttonStyle="solid"
                    onChange={(e) => setGender(e.target.value)}>
                    <Radio.Button value="a">Male</Radio.Button>
                    <Radio.Button value="b">Female</Radio.Button>
                </Radio.Group>
            </div>
            <div className='calorieCalcRow'>
                <div className='calorieCalcFieldText'>Height</div>
                <div className='calorieCalcHeight' >
                    <Input type='number' className={['calorieCalcFieldHeight', validFeet ? '' : 'inputInvalid'].join(' ')}
                        addonAfter="ft" size='large'
                        onChange={(e) => setFeet(parseInt(e.target.value))} />
                    <div style={{ width: '24px' }} />
                    <Input type='number' className={['calorieCalcFieldHeight', validInches ? '' : 'inputInvalid'].join(' ')}
                        addonAfter="in" size='large'
                        onChange={(e) => setInches(parseInt(e.target.value))} />
                </div>
            </div>
            <div className='calorieCalcRow'>
                <div className='calorieCalcFieldText'>Age</div>
                <Input type='number' className={['calorieCalcField', validAge ? '' : 'inputInvalid'].join(' ')}
                    addonAfter="years" size='large'
                    onChange={(e) => setAge(parseInt(e.target.value))} />
            </div>
            <div className='calorieCalcRow'>
                <div className='calorieCalcFieldText'>Weight</div>
                <Input type='number' className={['calorieCalcField', validWeight ? '' : 'inputInvalid'].join(' ')}
                    addonAfter="lbs" size='large'
                    onChange={(e) => setWeight(parseInt(e.target.value))} />
            </div>
            <div className='calorieCalcRow'>
                <div className='calorieCalcFieldText'>Activity level</div>
                <Select className='calorieCalcField'
                    defaultValue='a' size='large'
                    onChange={(val) => setActivity(val)}
                >
                    <Option className='camphorFont' value="a">Sedentary</Option>
                    <Option className='camphorFont' value="b">Lightly Active</Option>
                    <Option className='camphorFont' value="c">Moderately Active</Option>
                    <Option className='camphorFont' value="d">Very Active</Option>
                    <Option className='camphorFont' value="e">Extremely Active</Option>
                </Select>
            </div>
            <div className='calorieCalcButtonRow'>
                <a className='genButton' id={buttonShake ? 'buttonShake' : ''}
                    onClick={calculate} style={{ color: 'white', textAlign: 'center', width: '340px' }}>
                    <CalculatorFilled />&nbsp;
                    CALCULATE
                </a>
            </div>
            <div className='calorieCalcApplyRow' style={{ opacity: calories === 0 ? 0 : 1, height: calories === 0 ? 0 : '40px' }}>
                <div style={{ width: '340px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex' }}>
                        <div  >
                            Suggested calories:&nbsp;&nbsp;
                            </div>
                        <span className='underline' style={{ fontWeight: 500 }}>
                            {calories}
                        </span>
                    </div>
                    <a className='genButton' id={buttonShake ? 'buttonShake' : ''}
                        onClick={apply} style={{ color: 'white', backgroundColor: '#1890ff' }}>
                        <CheckOutlined />&nbsp;
                            APPLY
                        </a>
                </div>
            </div>

        </Modal >
    );
}

export default CalorieCalcModal;
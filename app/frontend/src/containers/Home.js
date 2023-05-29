import React, { useState, useEffect, useRef } from 'react';
import {
    Select, Alert, Collapse, Tabs, message
} from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import * as actions from '../store/actions/auth';
import 'antd/dist/antd.css';
import './index.css';
import MealCard from '../components/MealCard';
import Header from './Header';
import Footer from './Footer';
import SignupPanel from './SignupPanel';
import InfoPanel from './InfoPanel';
import InputBox from './InputBox';
import NutritionCard from '../components/NutritionCard';

import {
    fetchMeals, fetchBreakfast, fetchRegular,
    fetchBreakfastMain, fetchBreakfastSide,
    fetchRegularMain, fetchRegularSide
} from './FoodGenerator.js';

import './hamb/hamburgers.scss';

const emptyMeal = {
    name: '', calories: 0, carbs: 0,
    protein: 0, fat: 0, ingredients: [],
    instructions: [], servings: 0, makes: 0,
    prepTime: 0, cookTime: 0
}
const emptyObj = {
    main: emptyMeal,
    side: emptyMeal,
    mainLoading: false,
    sideLoading: false,
    mainPinned: false,
    sidePinned: false,
}

const calBounds = {
    // num meals: [lower bounds, upper bound]
    1: [400, 2100],
    2: [600, 4200],
    3: [800, 6300],
    4: [1110, 8400],
    5: [1400, 10600],
    6: [1600, 12800],
}

function useAsyncState(initialValue) {
    const [value, setValue] = useState(initialValue);
    const setter = x =>
        new Promise(resolve => {
            setValue(x);
            resolve(x);
        });
    return [value, setter];
}

const NewLayout = (props) => {

    const [calories, setCalories] = useState(2000);
    const [macros, setMacros] = useState({ carbs: 225, protein: 150, fat: 55 });
    const [numMeals, setNumMeals] = useState(3);
    const [availableTime, setAvailableTime] = useState(31); // 15, 30, or 45

    const [enableMacros, setEnableMacros] = useState(true);
    const [loadingMeals, setLoadingMeals] = useState(false); // used for gen button
    const [displayMeals, setDisplayMeals] = useState(false);
    const [changedPrefs, setChangedPrefs] = useState(true);
    const [macroPinned, setMacroPinned] = useState(null);
    const [validInput, setValidInput] = useState(true);
    const [inputBoxShake, setInputBoxShake] = useState(false);
    const [otherRegenLoadingMeals, setOtherRegenLoadingMeals] = useState(false);

    const [breakfastIter, setBreakfastIter] = useAsyncState(null);
    const breakfastRef = useRef(breakfastIter);
    breakfastRef.current = breakfastIter;
    const [breakfastSideIter, setBreakfastSideIter] = useAsyncState(null);
    const breakfastSideRef = useRef(breakfastSideIter);
    breakfastSideRef.current = breakfastSideIter;
    const [regularIter, setRegularIter] = useAsyncState(null);
    const regularRef = useRef(regularIter);
    regularRef.current = regularIter;
    const [regularSideIter, setRegularSideIter] = useAsyncState(null);
    const regularSideRef = useRef(regularSideIter);
    regularSideRef.current = regularSideIter;

    const [meal1, setMeal1] = useState(emptyObj);
    const [meal2, setMeal2] = useState(emptyObj);
    const [meal3, setMeal3] = useState(emptyObj);
    const [meal4, setMeal4] = useState(emptyObj);
    const [meal5, setMeal5] = useState(emptyObj);
    const [meal6, setMeal6] = useState(emptyObj);

    const [username, setUsername] = useState(null);

    const { TabPane } = Tabs;

    // run on initial render only
    useEffect(() => {
        console.log('on render');
        // get the username to be sent with the GET request when saving a meal
        if (props.isAuthenticated) {
            axios.get('/rest-auth/user/', {
                headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
            })
                .then(res => {
                    setUsername(res.data.username);
                })
                .catch(error => {
                    console.log(error);
                })
        }
        const s_calories = localStorage.getItem('calories');
        if (s_calories) setCalories(s_calories);
        const s_numMeals = localStorage.getItem('numMeals');
        if (s_numMeals) setNumMeals(s_numMeals);
        const s_macros = JSON.parse(localStorage.getItem('macros'));
        if (s_macros) setMacros(s_macros);
        const s_enableMacros = localStorage.getItem('enableMacros');
        if (typeof s_enableMacros === 'string') setEnableMacros(JSON.parse(s_enableMacros) === true);
        const s_displayMeals = localStorage.getItem('displayMeals');
        if (typeof s_displayMeals === 'string') setDisplayMeals(JSON.parse(s_displayMeals) === true);
        const s_changedPrefs = localStorage.getItem('changedPrefs');
        if (typeof s_changedPrefs === 'string') setChangedPrefs(JSON.parse(s_changedPrefs) === true)
        const s_availableTime = localStorage.getItem('availableTime');
        if (s_availableTime) setAvailableTime(parseInt(s_availableTime));

        const s_meal1 = JSON.parse(localStorage.getItem('meal1'));
        if (s_meal1) setMeal1(s_meal1);
        const s_meal2 = JSON.parse(localStorage.getItem('meal2'));
        if (s_meal2) setMeal2(s_meal2);
        const s_meal3 = JSON.parse(localStorage.getItem('meal3'));
        if (s_meal3) setMeal3(s_meal3);
        const s_meal4 = JSON.parse(localStorage.getItem('meal4'));
        if (s_meal4) setMeal4(s_meal4);
        const s_meal5 = JSON.parse(localStorage.getItem('meal5'));
        if (s_meal5) setMeal5(s_meal5);
        const s_meal6 = JSON.parse(localStorage.getItem('meal6'));
        if (s_meal6) setMeal6(s_meal6);

        // "takes in" an array and turn it back into an iterator
        const s_breakfastIter = JSON.parse(localStorage.getItem('breakfastIter'));
        if (s_breakfastIter) setBreakfastIter(s_breakfastIter[Symbol.iterator]());
        const s_breakfastSideIter = JSON.parse(localStorage.getItem('breakfastSideIter'));
        if (s_breakfastSideIter) setBreakfastSideIter(s_breakfastSideIter[Symbol.iterator]());
        const s_regularIter = JSON.parse(localStorage.getItem('regularIter'));
        if (s_regularIter) setRegularIter(s_regularIter[Symbol.iterator]());
        const s_regularSideIter = JSON.parse(localStorage.getItem('regularSideIter'));
        if (s_regularSideIter) setRegularSideIter(s_regularSideIter[Symbol.iterator]());
    }, []);

    // should split this up into multiple useEffects
    useEffect(() => {
        localStorage.setItem('calories', String(calories));
        localStorage.setItem('numMeals', String(numMeals));
        localStorage.setItem('macros', JSON.stringify(macros));
        localStorage.setItem('enableMacros', String(enableMacros));
        localStorage.setItem('displayMeals', String(displayMeals));
        localStorage.setItem('changedPrefs', String(changedPrefs));
        localStorage.setItem('availableTime', String(availableTime));

        localStorage.setItem('meal1', JSON.stringify(meal1));
        localStorage.setItem('meal2', JSON.stringify(meal2));
        localStorage.setItem('meal3', JSON.stringify(meal3));
        localStorage.setItem('meal4', JSON.stringify(meal4));
        localStorage.setItem('meal5', JSON.stringify(meal5));
        localStorage.setItem('meal6', JSON.stringify(meal6));
    })

    // Changing routes
    useEffect(() => {
        return props.history.listen((location) => {
            // console.log(`You changed the page to: ${location.pathname}`);
            // sends it in as an array
            localStorage.setItem('breakfastIter', JSON.stringify([...breakfastRef.current]));
            localStorage.setItem('breakfastSideIter', JSON.stringify([...breakfastSideRef.current]));
            localStorage.setItem('regularIter', JSON.stringify([...regularRef.current]));
            localStorage.setItem('regularSideIter', JSON.stringify([...regularSideRef.current]));
        })
    }, [props.history])

    // Page refresh or close window
    // does same as above
    useEffect(() => {
        window.onbeforeunload = (e) => {
            // sends it in as an array
            console.log('closing or refreshing');
            localStorage.setItem('breakfastIter', JSON.stringify([...breakfastRef.current]));
            localStorage.setItem('breakfastSideIter', JSON.stringify([...breakfastSideRef.current]));
            localStorage.setItem('regularIter', JSON.stringify([...regularRef.current]));
            localStorage.setItem('regularSideIter', JSON.stringify([...regularSideRef.current]));
        };
    });

    let isEmpty = a => Array.isArray(a) && a.every(isEmpty);

    function macroSwitch() {
        setEnableMacros(prev => {
            return !prev;
        });
        setChangedPrefs(true);
    }

    function onCalorieChange(value) {
        let cals = 0;
        if (typeof value === 'object') {
            cals = Math.floor(value.floatValue);
            if (typeof value.floatValue === 'undefined' || cals === 0) {
                setChangedPrefs(true);
                return;
            }
            if (cals < 0) {
                return;
            }
        }
        else {
            cals = Math.floor(value);
            if (cals === 0) {
                setCalories(0);
                setChangedPrefs(true);
                return;
            }
        }
        let carbPercent = macros.carbs / (macros.carbs + macros.protein + macros.fat * (9 / 4));
        let proteinPercent = macros.protein / (macros.carbs + macros.protein + macros.fat * (9 / 4));
        let fatPercent = (macros.fat * (9 / 4)) / (macros.carbs + macros.protein + macros.fat * (9 / 4));
        setCalories(cals);
        setMacros({
            carbs: (cals * carbPercent) / 4,
            protein: (cals * proteinPercent) / 4,
            fat: (cals * fatPercent) / 9
        });
        setChangedPrefs(true);
    }

    function pinMacro(num) {
        // set the pin to whichever macro is calling it, remove the pin if it already exists
        setMacroPinned(prev => prev === num ? null : num);
    }

    function carbSlider(percent) {
        let newCarbs = Math.round((percent * calories) / 400);
        let diff = newCarbs - macros.carbs;
        // if one of the other macros are zero and youre trying to increase carbs even more
        if (diff > 0 && ((macros.protein <= (calories * 0.15) / 4) ||
            (macros.fat <= (calories * 0.15) / 9))) {
            return;
        }
        // if one of the other macros are at 80% and youre trying to reduce carbs even more
        if (diff < 0 && ((macros.protein >= (calories * 0.70) / 4) ||
            (macros.fat >= (calories * 0.70) / 9))) {
            return;
        }
        if (macroPinned === null) {
            setMacros(prev => ({
                carbs: newCarbs,
                protein: prev.protein - (diff * 0.5),
                fat: prev.fat - (diff * 0.5 * (4 / 9)),
            }));
            setChangedPrefs(true);
        }
        else if (macroPinned === 1)
            return;
        else if (macroPinned === 2) {
            setMacros(prev => ({
                ...prev,
                carbs: newCarbs,
                fat: prev.fat - (diff * (4 / 9)),
            }));
            setChangedPrefs(true);
        }
        else if (macroPinned === 3) {
            setMacros(prev => ({
                ...prev,
                carbs: newCarbs,
                protein: prev.protein - diff,
            }));
            setChangedPrefs(true);
        }
    }

    function proteinSlider(percent) {
        let newProtein = Math.round((percent * calories) / 400);
        let diff = newProtein - macros.protein;
        if (diff > 0 && ((macros.carbs <= (calories * 0.15) / 4) ||
            (macros.fat <= (calories * 0.15) / 9))) {
            return;
        }
        if (diff < 0 && ((macros.carbs >= (calories * 0.7) / 4) ||
            (macros.fat >= (calories * 0.7) / 9))) {
            return;
        }

        if (macroPinned === null) {
            setMacros(prev => ({
                protein: newProtein,
                carbs: prev.carbs - (diff * 0.5),
                fat: prev.fat - (diff * 0.5 * (4 / 9)),
            }));
            setChangedPrefs(true);
        }
        else if (macroPinned === 1) {
            setMacros(prev => ({
                ...prev,
                protein: newProtein,
                fat: prev.fat - (diff * (4 / 9)),
            }));
            setChangedPrefs(true);
        }
        else if (macroPinned === 2)
            return;
        else if (macroPinned === 3) {
            setMacros(prev => ({
                ...prev,
                protein: newProtein,
                carbs: prev.carbs - diff,
            }));
            setChangedPrefs(true);
        }
    }

    function fatSlider(percent) {
        let newFat = Math.round((percent * calories) / 900);
        let diff = newFat - macros.fat;
        if (diff > 0 && ((macros.carbs <= (calories * 0.15) / 4) ||
            (macros.protein <= (calories * 0.15) / 4))) {
            return;
        }
        if (diff < 0 && ((macros.carbs >= (calories * 0.70) / 4) ||
            (macros.protein >= (calories * 0.70) / 4))) {
            return;
        }
        if (macroPinned === null) {
            setMacros(prev => ({
                fat: newFat,
                carbs: prev.carbs - (diff * 0.5 * (9 / 4)),
                protein: prev.protein - (diff * 0.5 * (9 / 4)),
            }));
            setChangedPrefs(true);
        }
        else if (macroPinned === 1) {
            setMacros(prev => ({
                ...prev,
                fat: newFat,
                protein: prev.protein - (diff * (9 / 4)),
            }));
            setChangedPrefs(true);
        }
        else if (macroPinned === 2) {
            setMacros(prev => ({
                ...prev,
                fat: newFat,
                carbs: prev.carbs - (diff * (9 / 4)),
            }));
            setChangedPrefs(true);
        }
        else if (macroPinned === 3) {
            return;
        }
    }

    function regenMain(num) {
        const mealVar = 'meal' + num.toString();
        const setMealVar = 'setMeal' + num.toString();
        // if it's already loading a meal, return (prevents spam clicking)
        if (eval(mealVar).mainLoading) {
            return;
        }
        eval(setMealVar)(prev => ({
            ...prev,
            mainLoading: true,
        }));

        updateMain(num);

        setTimeout(() => {
            eval(setMealVar)(prev => ({
                ...prev,
                // if it's still looking for the meal (aka the name didnt change), keep the loading icon
                // works bc of stale closures
                mainLoading: prev.main.name === eval(mealVar).main.name ? true : false,
            }));
        }, 500);
    }

    function regenSide(num) {
        const mealVar = 'meal' + num.toString();
        const setMealVar = 'setMeal' + num.toString();
        // if it's already loading a meal, return (prevents spam clicking)
        if (eval(mealVar).sideLoading) {
            return;
        }
        eval(setMealVar)(prev => ({
            ...prev,
            sideLoading: true,
        }));

        updateSide(num, true);

        setTimeout(() => {
            eval(setMealVar)(prev => ({
                ...prev,
                // if it's still looking for the meal (aka the name didnt change), keep the loading icon
                // works bc of stale closures
                sideLoading: prev.side.name === eval(mealVar).side.name ? true : false,
            }));
        }, 500);
    }

    function pinMain(num) {
        const setMealVar = 'setMeal' + num.toString();

        eval(setMealVar)(prev => ({
            ...prev,
            mainPinned: !prev.mainPinned,
        }));
    }

    function pinSide(num) {
        const setMealVar = 'setMeal' + num.toString();

        eval(setMealVar)(prev => ({
            ...prev,
            sidePinned: !prev.sidePinned,
        }));
    }

    function validateInput() {
        // true for valid, false for invalid
        if (calories < calBounds[numMeals][0] || calories > calBounds[numMeals][1])
            return false;
        else
            return true;
    }

    // not used, but it's to update both the meal and the side
    function updateMeal(num) {
        const setMealVar = 'setMeal' + num.toString();

        // IF BREAKFAST
        if (num === 1) {
            // iterator returns {value, done}
            const mealObj = breakfastRef.current.next();
            const sideObj = breakfastSideRef.current.next();
            if (!mealObj.done) {
                eval(setMealVar)(prev => ({
                    ...prev,
                    main: mealObj.value,
                    side: sideObj.value,
                }));
            } else {
                let carbVar = 0;
                let proteinVar = 0;
                let fatVar = 0;
                if (enableMacros) {
                    carbVar = Math.round(macros.carbs);
                    proteinVar = Math.round(macros.protein);
                    fatVar = Math.round(macros.fat);
                }
                fetchBreakfast(calories, numMeals,
                    carbVar, proteinVar, fatVar, availableTime)
                    .then(res => {
                        if (res[0][0].name === 'Network Error :(')
                            message.error('Network error: Cannot load meals.');
                        setBreakfastIter(res[0][Symbol.iterator]()).then(a => {
                            setBreakfastSideIter(res[1][Symbol.iterator]()).then(b => {
                                // now that the iters are loaded, set the meal with the new data
                                eval(setMealVar)(prev => ({
                                    ...prev,
                                    main: res[0][0],
                                    side: res[1][0],
                                    mainLoading: false,
                                    sideLoading: false,
                                }));
                                // and now increment the iterators since we just used the first entry
                                breakfastRef.current.next();
                                breakfastSideRef.current.next();
                            })
                        })
                    });
            }
        }
        // IF NOT BREAKFAST
        else {
            // iterator returns {value, done}
            const mealObj = regularRef.current.next();
            const sideObj = regularSideRef.current.next();
            if (!mealObj.done) {
                eval(setMealVar)(prev => ({
                    ...prev,
                    main: mealObj.value,
                    side: sideObj.value
                }));
            } else {
                let carbVar = 0;
                let proteinVar = 0;
                let fatVar = 0;
                if (enableMacros) {
                    carbVar = Math.round(macros.carbs);
                    proteinVar = Math.round(macros.protein);
                    fatVar = Math.round(macros.fat);
                }
                fetchRegular(calories, numMeals,
                    carbVar, proteinVar, fatVar, availableTime)
                    .then(res => {
                        if (res[0][0].name === 'Network Error :(')
                            message.error('Network error: Cannot load meals.');
                        setRegularIter(res[0][Symbol.iterator]());
                        setRegularSideIter(res[1][Symbol.iterator]());
                        // now that the iters are loaded, set the meal with the new data
                        eval(setMealVar)(prev => ({
                            ...prev,
                            main: res[0][0],
                            side: res[1][0],
                            mainLoading: false,
                            sideLoading: false,
                        }));
                        // and now increment the iterators since we just used the first entry
                        regularRef.current.next();
                        regularSideRef.current.next();
                    });
            }
        }
    }

    async function updateMain(num) {
        const setMealVar = 'setMeal' + num.toString();

        // IF BREAKFAST
        if (num === 1) {
            // iterator returns {value, done}
            const mealObj = breakfastRef.current.next();
            if (!mealObj.done) {
                eval(setMealVar)(prev => ({
                    ...prev,
                    main: mealObj.value,
                }));
            } else {
                let carbVar = 0;
                let proteinVar = 0;
                let fatVar = 0;
                if (enableMacros) {
                    carbVar = Math.round(macros.carbs);
                    proteinVar = Math.round(macros.protein);
                    fatVar = Math.round(macros.fat);
                }
                fetchBreakfastMain(calories, numMeals,
                    carbVar, proteinVar, fatVar, availableTime)
                    .then(res => {
                        console.log(res);
                        if (res[0][0].name === 'Network Error :(')
                            message.error('Network error: Cannot load meals.');
                        setBreakfastIter(res[0][Symbol.iterator]()).then(a => {
                            // now that the iter is loaded, set the meal with the new data
                            eval(setMealVar)(prev => ({
                                ...prev,
                                main: res[0][0],
                                mainLoading: false,
                            }));
                            // and now increment the iterator since we just used the first entry
                            breakfastRef.current.next();
                        })
                    });
            }
        }
        // IF NOT BREAKFAST
        else {
            // iterator returns {value, done}
            const mealObj = regularRef.current.next();
            if (!mealObj.done) {
                eval(setMealVar)(prev => ({
                    ...prev,
                    main: mealObj.value,
                }));
            } else {
                let carbVar = 0;
                let proteinVar = 0;
                let fatVar = 0;
                if (enableMacros) {
                    carbVar = Math.round(macros.carbs);
                    proteinVar = Math.round(macros.protein);
                    fatVar = Math.round(macros.fat);
                }
                await fetchRegularMain(calories, numMeals,
                    carbVar, proteinVar, fatVar, availableTime)
                    .then(res => {
                        if (res[0][0].name === 'Network Error :(')
                            message.error('Network error: Cannot load meals.');
                        setRegularIter(res[0][Symbol.iterator]()).then(a => {
                            // now that the iter is loaded, set the meal with the new data
                            eval(setMealVar)(prev => ({
                                ...prev,
                                main: res[0][0],
                                mainLoading: false,
                            }));
                            // and now increment the iterator since we just used the first entry
                            regularRef.current.next();
                        })
                    });
            }
        }
    }

    async function updateSide(num, fromRegen = false) {
        const setMealVar = 'setMeal' + num.toString();
        // IF BREAKFAST
        if (num === 1) {
            // iterator returns {value, done}
            const sideObj = breakfastSideRef.current.next();
            if (!sideObj.done) {
                // skips empty meals if it's from a regen
                if (fromRegen && sideObj.value.name === '') { // empty meal
                    return updateSide(num, true);
                }
                eval(setMealVar)(prev => ({
                    ...prev,
                    side: sideObj.value,
                }));
            } else {
                let carbVar = 0;
                let proteinVar = 0;
                let fatVar = 0;
                if (enableMacros) {
                    carbVar = Math.round(macros.carbs);
                    proteinVar = Math.round(macros.protein);
                    fatVar = Math.round(macros.fat);
                }
                fetchBreakfastSide(calories, numMeals,
                    carbVar, proteinVar, fatVar, availableTime)
                    .then(res => {
                        if (res[0][0].name === 'Network Error :(')
                            message.error('Network error: Cannot load meals.');
                        setBreakfastSideIter(res[0][Symbol.iterator]()).then(b => {
                            // now that the iters are loaded, set the meal with the new data
                            eval(setMealVar)(prev => ({
                                ...prev,
                                side: res[0][0],
                                sideLoading: false,
                            }));
                            // and now increment the iterator since we just used the first entry
                            breakfastSideRef.current.next();
                        })
                    });
            }
        }
        // IF NOT BREAKFAST
        else {
            // iterator returns {value, done}
            const sideObj = regularSideRef.current.next();
            if (!sideObj.done) {
                // skips empty meals if it's from a regen
                if (fromRegen && sideObj.value.name === '') { // empty meal
                    return updateSide(num, true);
                }
                eval(setMealVar)(prev => ({
                    ...prev,
                    side: sideObj.value
                }));
            } else {
                let carbVar = 0;
                let proteinVar = 0;
                let fatVar = 0;
                if (enableMacros) {
                    carbVar = Math.round(macros.carbs);
                    proteinVar = Math.round(macros.protein);
                    fatVar = Math.round(macros.fat);
                }
                await fetchRegularSide(calories, numMeals,
                    carbVar, proteinVar, fatVar, availableTime)
                    .then(res => {
                        if (res[0][0].name === 'Network Error :(')
                            message.error('Network error: Cannot load meals.');
                        setRegularSideIter(res[0][Symbol.iterator]()).then(a => {
                            // now that the iter is loaded, set the meal with the new data
                            eval(setMealVar)(prev => ({
                                ...prev,
                                side: res[0][0],
                                sideLoading: false,
                            }));
                            // and now increment the iterator since we just used the first entry
                            regularSideRef.current.next();
                        })
                    });
            }
        }
    }

    // recieves another parameter if the "regenerate" button above the meal cards, calls this function
    async function onClickGenerateButton(otherRegenButton) {
        // if it's already loading a meal, return (prevents spam clicking)
        if (loadingMeals || otherRegenLoadingMeals)
            return;

        if (!validateInput()) {
            setValidInput(false);
            setInputBoxShake(true);
            setTimeout(() => {
                setInputBoxShake(false);
            }, 600)
            return;
        } else {
            setValidInput(true);
        }

        // set the unpinned meals to loading
        for (let i = 1; i <= numMeals; i++) {
            eval(`setMeal${i}`)(prev => ({
                ...prev,
                mainLoading: !prev.mainPinned,
                sideLoading: !prev.sidePinned,
            }));
        }

        setDisplayMeals(false);
        if (otherRegenButton)
            setOtherRegenLoadingMeals(true);
        else
            setLoadingMeals(true);

        if (changedPrefs) {
            // get the meal data with the given preferences
            // and once that data is recieved (.then), update the state
            let carbVar = 0;
            let proteinVar = 0;
            let fatVar = 0;
            if (enableMacros) {
                carbVar = Math.round(macros.carbs);
                proteinVar = Math.round(macros.protein);
                fatVar = Math.round(macros.fat);
            }
            fetchMeals(calories, numMeals,
                carbVar, proteinVar, fatVar, availableTime)
                .then(res => {
                    if (res[0][0].name === 'Network Error :(')
                        message.error('Network error: Cannot load meals.');
                    console.log(`Getting all meals: ${calories}, ${numMeals}, ${carbVar}, ${proteinVar}, ${fatVar}`);
                    console.log(res);
                    setBreakfastIter(res[0][Symbol.iterator]()).then(a =>
                        setBreakfastSideIter(res[1][Symbol.iterator]()).then(b =>
                            setRegularIter(res[2][Symbol.iterator]()).then(c =>
                                setRegularSideIter(res[3][Symbol.iterator]()).then(d => {
                                    // now that the iters are set, update all the meals that aren't pinned
                                    for (let i = 1; i <= numMeals; i++) {
                                        if (!eval(`meal${i}`).mainPinned) {
                                            updateMain(i);
                                        }
                                        if (!eval(`meal${i}`).sidePinned) {
                                            updateSide(i);
                                        }
                                    }

                                    // turn the loading off
                                    for (let i = 1; i <= numMeals; i++) {
                                        eval(`setMeal${i}`)(prev => ({
                                            ...prev,
                                            mainLoading: false,
                                            sideLoading: false
                                        }));
                                    }
                                    setDisplayMeals(true);
                                    setLoadingMeals(false);
                                    setOtherRegenLoadingMeals(false);
                                    setChangedPrefs(false);
                                }))));
                });
        } else {
            // preferences haven't changed, use cached meals
            for (let i = 1; i <= numMeals; i++) {
                if (!eval(`meal${i}`).mainPinned) {
                    await updateMain(i);
                }
                if (!eval(`meal${i}`).sidePinned) {
                    await updateSide(i);
                }
            }
            // spin the loading icon for half a second so it does half a rotation
            setTimeout(() => {
                for (let i = 1; i <= numMeals; i++) {
                    // if it's still looking for the meal (aka the name didnt change), keep the loading icon
                    // must also check if it's pinned or obviously the names will be the same
                    // works bc of stale closures
                    eval(`setMeal${i}`)(prev => ({
                        ...prev,
                        mainLoading: !prev.mainPinned && prev.main.name === eval(`meal${i}`).main.name ? true : false,
                        sideLoading: !prev.sidePinned && prev.side.name === eval(`meal${i}`).side.name ? true : false,
                    }));
                }
                setDisplayMeals(true);
                setLoadingMeals(false);
                setOtherRegenLoadingMeals(false);
            }, 400); // 400 so with the delay and everything, it'll spin for half a second/rotation
        }
    };

    return (
        <div style={{ backgroundColor: '#fff' }}>
            <Header {...props} />

            <div className='topBody'>
                <div className='topBodyText'>
                    <div className='topBodyTitle'>
                        Create a customized meal plan in seconds.
                    </div>
                    <div style={{ height: '10px' }} />
                    <div className='topBodyCaption'>
                        Search though over 365,000 recipes.
                    </div>
                </div>

                <div className='calErrorDiv'>
                    <Alert className='calErrorAlert' style={{ opacity: validInput ? 0 : 1 }}
                        message={`For ${numMeals} meals, please enter between ${calBounds[numMeals][0]} and ${calBounds[numMeals][1]} calories.`}
                        type="error" showIcon />
                </div>

                <InputBox inputBoxShake={inputBoxShake} validInput={validInput} onCalorieChange={onCalorieChange} enableMacros={enableMacros}
                    setNumMeals={setNumMeals} setChangedPrefs={setChangedPrefs} onClickGenerateButton={onClickGenerateButton}
                    calories={calories} macros={macros} carbSlider={carbSlider} proteinSlider={proteinSlider} fatSlider={fatSlider}
                    macroSwitch={macroSwitch} loadingMeals={loadingMeals} macroPinned={macroPinned} pinMacro={pinMacro}
                    numMeals={numMeals} setAvailableTime={setAvailableTime} availableTime={availableTime} />
            </div>

            <div className='colMealCards'>
                <NutritionCard otherRegenLoadingMeals={otherRegenLoadingMeals}
                    onClickGenerateButton={onClickGenerateButton} changedPrefs={changedPrefs}
                    calories={meal1.main.calories + meal1.side.calories +
                        (numMeals >= 2 ? meal2.main.calories + meal2.side.calories : 0) +
                        (numMeals >= 3 ? meal3.main.calories + meal3.side.calories : 0) +
                        (numMeals >= 4 ? meal4.main.calories + meal4.side.calories : 0) +
                        (numMeals >= 5 ? meal5.main.calories + meal5.side.calories : 0) +
                        (numMeals >= 6 ? meal6.main.calories + meal6.side.calories : 0)}
                    carbs={meal1.main.carbs + meal1.side.carbs +
                        (numMeals >= 2 ? meal2.main.carbs + meal2.side.carbs : 0) +
                        (numMeals >= 3 ? meal3.main.carbs + meal3.side.carbs : 0) +
                        (numMeals >= 4 ? meal4.main.carbs + meal4.side.carbs : 0) +
                        (numMeals >= 5 ? meal5.main.carbs + meal5.side.carbs : 0) +
                        (numMeals >= 6 ? meal6.main.carbs + meal6.side.carbs : 0)}
                    protein={meal1.main.protein + meal1.side.protein +
                        (numMeals >= 2 ? meal2.main.protein + meal2.side.protein : 0) +
                        (numMeals >= 3 ? meal3.main.protein + meal3.side.protein : 0) +
                        (numMeals >= 4 ? meal4.main.protein + meal4.side.protein : 0) +
                        (numMeals >= 5 ? meal5.main.protein + meal5.side.protein : 0) +
                        (numMeals >= 6 ? meal6.main.protein + meal6.side.protein : 0)}
                    fat={meal1.main.fat + meal1.side.fat +
                        (numMeals >= 2 ? meal2.main.fat + meal2.side.fat : 0) +
                        (numMeals >= 3 ? meal3.main.fat + meal3.side.fat : 0) +
                        (numMeals >= 4 ? meal4.main.fat + meal4.side.fat : 0) +
                        (numMeals >= 5 ? meal5.main.fat + meal5.side.fat : 0) +
                        (numMeals >= 6 ? meal6.main.fat + meal6.side.fat : 0)} />

                <MealCard mealNum={1} mealObj={meal1} numMeals={numMeals}
                    displayMeals={displayMeals} isAuthenticated={props.isAuthenticated}
                    regenMain={regenMain} regenSide={regenSide} username={username}
                    pinMain={pinMain} pinSide={pinSide} />

                <MealCard mealNum={2} mealObj={meal2} numMeals={numMeals}
                    displayMeals={displayMeals} isAuthenticated={props.isAuthenticated}
                    regenMain={regenMain} regenSide={regenSide} username={username}
                    pinMain={pinMain} pinSide={pinSide} />

                <MealCard mealNum={3} mealObj={meal3} numMeals={numMeals}
                    displayMeals={displayMeals} isAuthenticated={props.isAuthenticated}
                    regenMain={regenMain} regenSide={regenSide} username={username}
                    pinMain={pinMain} pinSide={pinSide} />

                <MealCard mealNum={4} mealObj={meal4} numMeals={numMeals}
                    displayMeals={displayMeals} isAuthenticated={props.isAuthenticated}
                    regenMain={regenMain} regenSide={regenSide} username={username}
                    pinMain={pinMain} pinSide={pinSide} />

                <MealCard mealNum={5} mealObj={meal5} numMeals={numMeals}
                    displayMeals={displayMeals} isAuthenticated={props.isAuthenticated}
                    regenMain={regenMain} regenSide={regenSide} username={username}
                    pinMain={pinMain} pinSide={pinSide} />

                <MealCard mealNum={6} mealObj={meal6} numMeals={numMeals}
                    displayMeals={displayMeals} isAuthenticated={props.isAuthenticated}
                    regenMain={regenMain} regenSide={regenSide} username={username}
                    pinMain={pinMain} pinSide={pinSide} />

                <div style={{ height: '35px' }} />
            </div>

            <div className='belowCardSlant' />

            <InfoPanel />

            <SignupPanel />

            <Footer />

        </div >
    )
}


const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout())
    }
}

export default withRouter(connect(null, mapDispatchToProps)(NewLayout));

// ======= This is the file where the api calls are located  =======
// ================ and the meal plan is made ======================

import { breakfastSides } from './BreakfastSides';

import axios from "axios";

// functions:
// fetchMeals (get everything)
// fetchBreakfast (gets breakfast main and side)
// fetchBreakfastMain
// fetchBreakfastSide
// fetchRegular
// fetchRegularMain
// fetchRegularSide

// Create an Axios instance that all the axios requests to Spoonacular will use
const instance = axios.create({
    method: 'get',
    baseURL: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch',
    timeout: 12000,
    headers: {
        'content-type': 'application/octet-stream',
        'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
        'x-rapidapi-key': '2db6ce35d9mshf0292532e1abc1cp12f8dbjsn11340ad7f73e',
    },
});

// Parameters to be sent into all the get requests
const defaultParams = {
    instructionsRequired: true,
    addRecipeInformation: true,
    fillIngredients: true,
    maxAlcohol: 0,
    sort: 'random',
}

const emptyMeal = {
    name: '', calories: 0, carbs: 0,
    protein: 0, fat: 0, ingredients: [],
    instructions: [], servings: 0, makes: 0,
    prepTime: 0, cookTime: 0
}

const noMeal = {
    name: 'No meals found :(', calories: 0, carbs: 0,
    protein: 0, fat: 0, ingredients: [],
    instructions: [], servings: 0, makes: 0,
    prepTime: 0, cookTime: 0
}

const errorMeal = {
    name: 'Network Error :(', calories: 0, carbs: 0,
    protein: 0, fat: 0, ingredients: [],
    instructions: [], servings: 0, makes: 0,
    prepTime: 0, cookTime: 0
}

// percent chance a main side appears
const randMainSides = 0.65;

// ========== Fetch all meals ==========
export async function fetchMeals(cals, numMeals, carbs, protein, fat, availableTime) {
    console.log('Fetching all meals');
    console.log(typeof availableTime);
    if (numMeals === 1) {
        const feast = await fetchBreakfast(cals, numMeals, carbs, protein, fat, availableTime);
        return [...feast, [], []];
    } else {
        const [breakfast, main] = await Promise.all([
            fetchBreakfast(cals, numMeals, carbs, protein, fat, availableTime),
            fetchRegular(cals, numMeals, carbs, protein, fat, availableTime),
        ]);
        return [...breakfast, ...main];
    }
}

// ========== Fetch both breakfast main and side ==========
export async function fetchBreakfast(cals, numMeals, carbs, protein, fat, availableTime) {
    console.log('Fetching all breakfast');
    const [main, side] = await Promise.all([
        fetchBreakfastMain(cals, numMeals, carbs, protein, fat, availableTime),
        fetchBreakfastSide(cals, numMeals, carbs, protein, fat, availableTime),
    ]);
    return [...main, ...side];
}

// ========== Fetch both breakfast main and side ==========
export async function fetchRegular(cals, numMeals, carbs, protein, fat, availableTime) {
    console.log('Fetching all regular');
    const [main, side] = await Promise.all([
        fetchRegularMain(cals, numMeals, carbs, protein, fat, availableTime),
        fetchRegularSide(cals, numMeals, carbs, protein, fat, availableTime),
    ]);
    return [...main, ...side];
}

export async function fetchBreakfastMain(cals, numMeals, carbs, protein, fat, availableTime) {
    console.log('Fetching breakfast main');
    return fetchBreakfastMainData(cals, numMeals, carbs, protein, fat, availableTime)
        .then(d => {
            const servings = d[0];
            const breakfastData = d[1];

            // error handling
            if (servings === 0)
                return [[errorMeal]];

            // if no meals were found
            if (!Array.isArray(breakfastData) || !breakfastData.length) {
                return [[noMeal]];
            }

            // return an array of meals

            // ======== BREAKFAST MEALS ========
            let breakfastRes = [];
            breakfastData.forEach(elem => {
                const name = elem.title;
                // console.log('elem', elem)
                const calories = Math.floor(elem.nutrition.nutrients[0].amount) * servings;
                const carbs = Math.floor(elem.nutrition.nutrients[3].amount) * servings;
                const protein = Math.floor(elem.nutrition.nutrients[1].amount) * servings;
                const fat = Math.floor(elem.nutrition.nutrients[2].amount) * servings;
                let instructions = [];
                let instArr = elem.analyzedInstructions;
                if (instArr && instArr.length) {
                    instArr[0].steps.forEach((inst) => {
                        instructions.push(inst.step);
                    })
                }
                let ingredients = [];
                elem.extendedIngredients.forEach((ing) => {
                    ingredients.push(ing.original);
                })
                const makes = elem.servings;
                const prepTime = elem.preparationMinutes;
                const cookTime = elem.cookingMinutes;

                const obj = {
                    name: name, calories: calories, carbs: carbs,
                    protein: protein, fat: fat, ingredients: ingredients,
                    instructions: instructions, servings: servings, makes: makes,
                    prepTime: prepTime, cookTime: cookTime
                };

                breakfastRes.push(obj);
            })

            return [breakfastRes];
        })
}

async function fetchBreakfastMainData(cals, numMeals, carbs, protein, fat, availableTime) {
    let approxCals = 0;
    let minCals = 0;
    let maxCals = 0;
    let minCarbs = 0;
    let maxCarbs = 0;
    let minProtein = 0;
    let maxProtein = 0;
    let minFat = 0;
    let maxFat = 0;

    if (numMeals === 1) {
        approxCals = cals - 200; // bc guaranteed two sides
    } else if (numMeals === 2) {
        approxCals = Math.floor((2 / 5) * cals) - 100; // bc one side
    } else {
        approxCals = Math.floor(cals / numMeals) - 100; // bc one side
    }

    // if macros aren't enabled, get breakfast servings the "normal" way
    // else call the other function, which will give more servings thus smaller cal meals
    let servings = 1;
    if (carbs === 0 && protein === 0 && fat === 0)
        servings = getServings(approxCals);
    else
        servings = getBreakfastServings(approxCals);

    // target = (approxCals - 100) +- 25
    let avgCals = Math.floor(approxCals / servings);
    minCals = avgCals - 25;
    maxCals = avgCals + 25;

    // if they all equal 0, macro preferences are off and make the macros anything
    if (carbs === 0 && protein === 0 && fat === 0) {
        minCarbs = 0;
        maxCarbs = 1000;
        minProtein = 0;
        maxProtein = 1000;
        minFat = 0;
        maxFat = 1000;
    } else {
        let percentCarbs = carbs / (carbs + protein + fat * (9 / 4));
        let percentProtein = protein / (carbs + protein + fat * (9 / 4));
        let percentFat = (fat * (9 / 4)) / (carbs + protein + fat * (9 / 4));
        minCarbs = Math.floor((avgCals * percentCarbs) / 4) - 13;
        maxCarbs = Math.floor((avgCals * percentCarbs) / 4) + 13;
        minProtein = Math.floor((avgCals * percentProtein) / 4) - 13;
        maxProtein = Math.floor((avgCals * percentProtein) / 4) + 13;
        minFat = Math.floor((avgCals * percentFat) / 9) - 7;
        maxFat = Math.floor((avgCals * percentFat) / 9) + 7;
    }

    try {
        const breakfastMeals = await
            instance({ // breakfast (6)
                "params": {
                    ...defaultParams,
                    minCalories: minCals,
                    maxCalories: maxCals,
                    minCarbs: minCarbs,
                    maxCarbs: maxCarbs,
                    minProtein: minProtein,
                    maxProtein: maxProtein,
                    minFat: minFat,
                    maxFat: maxFat,
                    type: (numMeals > 1) ? 'breakfast' : 'main+course',
                    maxReadyTime: availableTime,
                    number: 6,
                }
            });
        // will throw an error if we do 'const breakfastMeals' and then 'return breakfastMeals'
        return [servings, breakfastMeals.data.results]; // return servings each meal has (not makes) with the meals
    } catch (error) {
        console.log(error);
        return [0, [errorMeal]];
    }
}

export async function fetchBreakfastSide(cals, numMeals, carbs, protein, fat, availableTime) {
    console.log('Fetching breakfast side');
    if (numMeals === 1) {
        // always two sides with 1 meal
        let servings = 2;
        return fetchBreakfastSideData(cals, numMeals, carbs, protein, fat, availableTime)
            .then(d => {
                const sidesData = d.data.results;

                // error handling
                if (sidesData === 0)
                    return [[errorMeal]];

                // if no meals were found
                if (!Array.isArray(sidesData) || !sidesData.length) {
                    return [[noMeal]];
                }

                // return an array of meals

                // ======== MAIN SIDES ========
                let sidesRes = [];
                sidesData.forEach(elem => {
                    const name = elem.title;
                    const calories = Math.floor(elem.nutrition[0].amount) * servings;
                    const carbs = Math.floor(elem.nutrition[3].amount) * servings;
                    const protein = Math.floor(elem.nutrition[1].amount) * servings;
                    const fat = Math.floor(elem.nutrition[2].amount) * servings;
                    let instructions = [];
                    let instArr = elem.analyzedInstructions;
                    if (instArr && instArr.length) {
                        instArr[0].steps.forEach((inst) => {
                            instructions.push(inst.step);
                        })
                    }
                    let ingredients = [];
                    elem.extendedIngredients.forEach((ing) => {
                        ingredients.push(ing.original);
                    })
                    const makes = elem.servings;
                    const prepTime = elem.preparationMinutes;
                    const cookTime = elem.cookingMinutes;
                    const obj = {
                        name: name, calories: calories, carbs: carbs,
                        protein: protein, fat: fat, ingredients: ingredients,
                        instructions: instructions, servings: servings, makes: makes,
                        prepTime: prepTime, cookTime: cookTime
                    };

                    sidesRes.push(obj);
                })

                return [sidesRes];
            })
    } else {
        // if numMeals > 1
        return fetchBreakfastSideData(cals, numMeals, carbs, protein, fat)
            .then(d => {
                return d;
            });
    }
}

async function fetchBreakfastSideData(cals, numMeals, carbs, protein, fat, availableTime) {
    if (numMeals === 1) {
        let maxSideCals = 150;

        try {
            const sides = await
                instance({ // sides
                    "params": {
                        ...defaultParams,
                        maxCalories: maxSideCals,
                        minCarbs: 0,
                        minProtein: 0,
                        minFat: 0,
                        type: 'side+dish',
                        maxReadyTime: availableTime,
                        number: 6
                    }
                });
            return sides;
        } catch (error) {
            console.log(error);
            return { sides: { results: 0 } };
        }
    }
    else {
        // let it wait at least half a second before returning, so it's not instant
        let res = await new Promise((resolve) => {
            setTimeout(() => {
                // return 6 random sides from the breakfast sides array
                resolve([breakfastSides.sort(() => .5 - Math.random()).slice(0, 6)]);
            }, 500)
        })
        return res;
    }
}

export async function fetchRegularMain(cals, numMeals, carbs, protein, fat, availableTime) {
    console.log('Fetching regular main');
    return fetchRegularMainData(cals, numMeals, carbs, protein, fat, availableTime)
        .then(d => {
            const servings = d[0]
            const mainData = d[1];

            // error handling
            if (servings === 0)
                return [[errorMeal]];

            // if no meals were found
            if (!Array.isArray(mainData) || !mainData.length) {
                return [[noMeal]];
            }

            // return an array of meals

            // ======== MAIN MEALS ========
            let mainRes = [];
            mainData.forEach(elem => {
                const name = elem.title;
                const calories = Math.floor(elem.nutrition.nutrients[0].amount) * servings;
                const carbs = Math.floor(elem.nutrition.nutrients[3].amount) * servings;
                const protein = Math.floor(elem.nutrition.nutrients[1].amount) * servings;
                const fat = Math.floor(elem.nutrition.nutrients[2].amount) * servings;
                let instructions = [];
                let instArr = elem.analyzedInstructions;
                if (instArr && instArr.length) {
                    instArr[0].steps.forEach((inst) => {
                        instructions.push(inst.step);
                    })
                }
                let ingredients = [];
                elem.extendedIngredients.forEach((ing) => {
                    ingredients.push(ing.original);
                })
                const makes = elem.servings;
                const prepTime = elem.preparationMinutes;
                const cookTime = elem.cookingMinutes;
                const obj = {
                    name: name, calories: calories, carbs: carbs,
                    protein: protein, fat: fat, ingredients: ingredients,
                    instructions: instructions, servings: servings, makes: makes,
                    prepTime: prepTime, cookTime: cookTime
                };

                mainRes.push(obj);
            })

            return [mainRes];
        })

}
async function fetchRegularMainData(cals, numMeals, carbs, protein, fat, availableTime) {
    let approxCals = 0;
    let minCals = 0;
    let maxCals = 0;
    let minCarbs = 0;
    let maxCarbs = 0;
    let minProtein = 0;
    let maxProtein = 0;
    let minFat = 0;
    let maxFat = 0;

    if (numMeals === 2) {
        //just get one dinner
        approxCals = Math.floor((3 / 5) * cals) - (100 * randMainSides);
    } else { //numMeals === 3-6
        approxCals = Math.floor(cals / numMeals) - (100 * randMainSides);
    }

    let servings = getServings(approxCals);

    // target = (approxCals - 150) +- 25 bc guaranteed side
    let avgCals = Math.floor(approxCals / servings);
    minCals = avgCals - 25;
    maxCals = avgCals + 25;

    if (carbs === 0 && protein === 0 && fat === 0) {
        minCarbs = 0;
        maxCarbs = 1000;
        minProtein = 0;
        maxProtein = 1000;
        minFat = 0;
        maxFat = 1000;
    } else {
        let percentCarbs = carbs / (carbs + protein + fat * (9 / 4));
        let percentProtein = protein / (carbs + protein + fat * (9 / 4));
        let percentFat = (fat * (9 / 4)) / (carbs + protein + fat * (9 / 4));
        minCarbs = Math.floor((avgCals * percentCarbs) / 4) - 10;
        maxCarbs = Math.floor((avgCals * percentCarbs) / 4) + 10;
        minProtein = Math.floor((avgCals * percentProtein) / 4) - 10;
        maxProtein = Math.floor((avgCals * percentProtein) / 4) + 10;
        minFat = Math.floor((avgCals * percentFat) / 9) - 5;
        maxFat = Math.floor((avgCals * percentFat) / 9) + 5;
    }

    try {
        const main = await
            instance({ // main meals (6 * numMeals)
                "params": {
                    ...defaultParams,
                    minCalories: minCals,
                    maxCalories: maxCals,
                    minCarbs: minCarbs,
                    maxCarbs: maxCarbs,
                    minProtein: minProtein,
                    maxProtein: maxProtein,
                    minFat: minFat,
                    maxFat: maxFat,
                    type: 'main+course',
                    maxReadyTime: availableTime,
                    number: 6 * (numMeals - 1), //exclude bfast
                }
            });
        return [servings, main.data.results];
    } catch (error) {
        console.log(error);
        return [0, [errorMeal]];
    }
}

export async function fetchRegularSide(cals, numMeals, carbs, protein, fat, availableTime) {
    console.log('Fetching regular side');
    return fetchRegularSideData(cals, numMeals, carbs, protein, fat, availableTime)
        .then(d => {
            const servings = d[0];
            const sidesData = d[1];

            // error handling
            if (servings === 0)
                return [[errorMeal]];

            // if no meals were found
            if (!Array.isArray(sidesData) || !sidesData.length) {
                return [[noMeal]];
            }

            // return an array of meals

            // ======== MAIN SIDES ========
            let sidesRes = [];
            sidesData.forEach(elem => {
                const name = elem.title;
                const calories = Math.floor(elem.nutrition.nutrients[0].amount) * servings;
                const carbs = Math.floor(elem.nutrition.nutrients[3].amount) * servings;
                const protein = Math.floor(elem.nutrition.nutrients[1].amount) * servings;
                const fat = Math.floor(elem.nutrition.nutrients[2].amount) * servings;
                let instructions = [];
                let instArr = elem.analyzedInstructions;
                if (instArr && instArr.length) {
                    instArr[0].steps.forEach((inst) => {
                        instructions.push(inst.step);
                    })
                }
                let ingredients = [];
                elem.extendedIngredients.forEach((ing) => {
                    ingredients.push(ing.original);
                })
                const makes = elem.servings;
                const prepTime = elem.preparationMinutes;
                const cookTime = elem.cookingMinutes;
                const obj = {
                    name: name, calories: calories, carbs: carbs,
                    protein: protein, fat: fat, ingredients: ingredients,
                    instructions: instructions, servings: servings, makes: makes,
                    prepTime: prepTime, cookTime: cookTime
                };

                if (numMeals === 2)
                    sidesRes.push(obj);
                else {
                    if (Math.random() < randMainSides)
                        sidesRes.push(obj);
                    else
                        sidesRes.push(emptyMeal);
                }
            })

            return [sidesRes];
        })
}
async function fetchRegularSideData(cals, numMeals, carbs, protein, fat, availableTime) {
    let maxSideCals = 150;
    let servings = 1;

    try {
        const mainSides = await
            instance({ // main sides (6 * numMeals)
                "params": {
                    ...defaultParams,
                    maxCalories: maxSideCals,
                    minCarbs: 0,
                    minProtein: 0,
                    minFat: 0,
                    type: 'side+dish',
                    maxReadyTime: availableTime,
                    number: 6 * (numMeals - 1), //exclude bfast
                }
            });
        return [servings, mainSides.data.results];
    } catch (error) {
        console.log(error);
        return [0, [errorMeal]];
    }
}

function getServings(cals) {
    let num = Math.random();
    if (cals < 600)
        return 1;
    else if (cals < 700)
        return (num < 0.70 ? 2 : 1);
    else if (cals < 800)
        return (num < 0.90 ? 2 : 1);
    else if (cals < 900)
        return (num < 0.20 ? 3 : 2);
    else if (cals < 1000)
        return (num < 0.35 ? 3 : 2);
    else if (cals < 1100)
        return (num < 0.70 ? 3 : 2);
    else if (cals < 1200)
        return (num < 0.85 ? 3 : 2);
    else if (cals < 1300)
        return (num < 0.10 ? 4 : 3);
    else if (cals < 1400)
        return (num < 0.25 ? 4 : 3);
    else if (cals < 1500)
        return (num < 0.40 ? 4 : 3);
    else if (cals < 1700)
        return (num < 0.80 ? 4 : 3);
    else if (cals < 1900)
        return (num < 0.50 ? 5 : 4);
    else // cals should be less than 2000
        return 5;
}

// this nearly idencial function is needed bc getting a breakfast with macros
// is difficult unless you there is a small number of calories
// try to make all cals in range of 200 - 400ish
function getBreakfastServings(cals) {
    let num = Math.random();
    if (cals < 450)
        return 1;
    else if (cals < 700)
        return 2;
    else if (cals < 800)
        return (num < 0.80 ? 3 : 2);
    else if (cals < 900)
        return (num < 0.20 ? 4 : 3);
    else if (cals < 1000)
        return (num < 0.40 ? 4 : 3);
    else if (cals < 1100)
        return (num < 0.60 ? 4 : 3);
    else if (cals < 1200)
        return (num < 0.80 ? 4 : 3);
    else if (cals < 1300)
        return (num < 0.20 ? 5 : 4);
    else if (cals < 1400)
        return (num < 0.40 ? 5 : 4);
    else if (cals < 1500)
        return (num < 0.60 ? 5 : 4);
    else if (cals < 1600)
        return (num < 0.80 ? 5 : 4);
    else if (cals < 1800)
        return (num < 0.30 ? 6 : 5);
    else // cals should be less than 2000
        return 6;
}

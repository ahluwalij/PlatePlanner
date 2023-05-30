import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

function HowItWorks(props) {

    useEffect(() => {
        // setTimeout(() => Prism.highlightAll(), 0)
    }, [])


    return (
        <>
            <Header {...props} />
            <div className='hiw'>
                <div className='hiwBody'>
                    <h2>
                        Technologies
                    </h2>
                    <div className='space8' />
                    <p>
                        This website is not just built with Javascript, HTML, and CSS.  One of the main technologies behind this site
                        is <a href='https://reactjs.org/'>React</a>, which helped with the state management
                        (along with <a href='https://redux.js.org/'>Redux</a>).
                        This was crucial to keeping all the components' data up to date as meals are refreshed.
                    </p>
                    <p>
                        Plate Plan also uses <a href='https://www.djangoproject.com/'>Django</a> for the backend, mainly for user authentication and
                        the storage of users' saved meals. In addition, the site uses <a href='https://ant.design/'>Ant Design</a> for various components,
                        and <a href='https://www.chartjs.org/'>ChartJS</a> for the pie charts.
                    </p>
                    <div className='space8' />
                    <h2>
                        Food algorithm
                    </h2>
                    <div className='space8' />
                    <p>
                        All of the food data is sourced from the <a href='https://spoonacular.com/food-api'>Spoonacular API</a>. This is a database
                        of over 365,000 recipes that allows for a randomized searching of recipes based on calories, macros, meal type, etc.
                    </p>
                    <p>
                        Whenever the user hits the generate button, a GET request is sent to Spoonacular's API to fetch recipes based on the given parameters.
                    </p>
                    <div className='hiwCode'>
                        <pre className='hiwPreCode'>
                            <code>
                                {"axios.get('https://api.spoonacular.com/recipe/complexSearch', {"}<br />
                                {"            params: {"}<br />
                                {"              minCals: 400,"}<br />
                                {"              maxProtein: 40,"}<br />
                                {"              type: 'main+course',"}<br />
                                {"              number: 6,"}<br />
                                {"              sort: 'random',"}<br />
                                {"              ...otherParams"}<br />
                                {"            }"}<br />
                                {"        });"}<br />
                            </code>
                        </pre>
                    </div>
                    <p>
                        For a simple example, say the user wants to eat 2100 calories in 3 meals. The calories and macronutrients will get evenly divided between
                        the meals, so each meal will have roughly 700 calories. There is also a random chance for a meal to include a side. The number of
                        servings per meal is also randomized.  Using the above example, the user might recieve 1 serving of a 700 calorie meal, or 2 servings
                        of a 350 calorie meal.  This becomes necessary when the calories per meal becomes very high, as there are no recipies where each serving
                        is say, 1200 calories.
                    </p>
                    <p>
                        Behind the scenes, Plate Plan caches meals to minimize the amount of API calls it does to Spoonacular.  For every meal generated,
                        an extra five is generated during the same API call.  This results in refreshing meals usually being instantaneous.  The
                        orchestration of trying to maximize the use cached meals during regeneration, while fetching meals and keeping certain meals pinned, was
                        the most difficult part of this project.
                    </p>
                    <p>
                        Check out the actual implementation over at <a href='https://github.com/ahluwalij/plateplanner-meal-generator'>my Github</a>.
                    </p>
                    <div className='space8' />
                    <h2>
                        Features to add
                    </h2>
                    <div className='space8' />
                    <ul>
                        <li>
                            Filter by diet and intolerances
                        </li>
                        <li>
                            Include certain ingredients (foods in your pantry?)
                        </li>
                        <li>
                            Exclude ingredients you don't like
                        </li>
                        <li>
                            A stream/feed at the bottom of the site with meals other users have saved
                        </li>
                        <li>
                            Authentication with social media accounts
                        </li>
                        <li>
                            Search for specific recipes and add them directly to your meal plan
                        </li>
                        <li>
                            Regenerate an entire meal at a time
                        </li>
                        <li>
                            Have total calories be within ±100 of desired calories
                        </li>
                    </ul>
                </div>
            </div>
            <div style={{ height: '100px' }} />
            <Footer />
        </>
    )
}


export default HowItWorks;

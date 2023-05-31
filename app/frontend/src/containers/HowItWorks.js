import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

function HowItWorks(props) {
  useEffect(() => {
    // setTimeout(() => Prism.highlightAll(), 0)
  }, []);

  return (
    <>
      <Header {...props} />
      <div className="hiw">
        <div className="hiwBody">
          <h2>Tech Stack</h2>
          <div className="space8" />
          <p>
            This website is not just built with Javascript, HTML, and CSS. One
            of the main technologies behind this site is{" "}
            <a href="https://reactjs.org/">React</a>, which helped with the
            state management (along with{" "}
            <a href="https://redux.js.org/">Redux</a>). This was crucial to
            keeping all the components' data up to date as meals are refreshed.
          </p>
          <p>
            Plate Planner uses a <a href="https://www.mysql.com/">MySQL</a> as a
            relational database, in order to authenticate users, save their
            calorie/macronutrient preferences, and also any meals that they
            favorited. I am utilizing{" "}
            <a href="https://vercel.com/home">Vercel</a> to host the site and
            domain name, as well as{" "}
            <a href="https://www.heroku.com/home?">Heroku</a> alongside
            <a href="https://www.djangoproject.com/"> Django</a> to host the
            backend API.
          </p>

          <div className="space8" />
          <h2>Meal Plan Algorithm</h2>
          <div className="space8" />
          <p>
            All of the food data is obtained from a recipe database called{" "}
            <a href="https://spoonacular.com/food-api">Spoonacular API</a>. This
            API provides a vast database of over 365,000 recipes, allowing for
            randomized recipe searches through a multiple requests.
          </p>
          <p>
            When the user clicks the generate button, multiple GET requests are
            sent to the Spoonacular API to retrieve recipes based on the
            specified parameters, and put together into a singular meal plan for
            the user to follow throughout the day.
          </p>
          <p>
            Plate Planner also implements a caching mechanism to minimize the
            number of API calls made to Spoonacular. For each generated meal, an
            additional five meals are created during the same API call. This
            approach ensures that refreshing meals is usually instantaneous. The
            orchestration of maximizing the use of cached meals during
            regeneration, while fetching new meals and preserving specific
            meals, proved to be the most challenging aspect of this project.
          </p>
          <p>
            For the actual implementation, you can visit{" "}
            <a href="https://github.com/ahluwalij/plateplanner-meal-generator">
              my Github repository
            </a>
            .
          </p>
        </div>
      </div>
      <div style={{ height: "100px" }} />
      <Footer />
    </>
  );
}

export default HowItWorks;

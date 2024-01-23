import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";

function About(props) {
  return (
    <>
      <Header {...props} />
      <div className="about">
        <div className="aboutBody">
          <h2>About</h2>
          <div className="space8" />
          <p>
            Hey there! My name is Jasdeep, and I am the creator of PlatePlanner.
          </p>
          <p>
            I'm currently a Computer Science & Statistics student at the University of
            Maryland, graduating May 2025.
          </p>
          <div className="space8" />
          <h2>Inspiration</h2>
          <div className="space8" />
          <p>
            The idea for creating Plate Planner emerged towards the end of 2022,
            driven by my passion for fitness and the desire to make a meaningful
            impact. As a computer science student at the University of Maryland,
            I recognized that web development wasn't extensively covered in my
            coursework. Intrigued by the subject, and fueled by my passion of
            web development, I saw an opportunity to delve into this domain
            while simultaneously crafting a tool that could assist others in
            their health and nutrition journeys. It was a chance for me to
            explore new technologies and expand my skill set.
          </p>
          <p>
            It was during this time that the idea for Plate Planner was born.
            Tired of eating the same chicken and rice meals every day, I wanted
            to find a better way to meet my nutritional goals without
            sacrificing taste. That's when the concept of a meal plan generator
            struck me. I envisioned a website that could generate randomized
            meal plans based on calorie and macronutrient information, providing
            users with a variety of delicious and balanced options. To bring
            this idea to life, I needed access to a reliable food database.
            Initially, I explored the USDA food database, which contains an
            extensive collection of food items found on nutrition labels.
            However, I encountered challenges in matching foods together to
            create cohesive meals. This led me to discover the Spoonacular API,
            a database packed with an abundance of recipes. The integration of
            this API allowed me to generate diverse and flavorful meal options.
            For a more detailed explanation of how Plate Planner works, you can
            visit the <Link to="/howitworks">how it works</Link> page.
          </p>
          <div className="space8" />
          <h2>Development</h2>
          <div className="space8" />
          <p>
            The development process of Plate Planner was an exhilarating journey
            where I had the opportunity to showcase my passion for web
            development. With my background in building websites and a strong
            foundation in computer science, I approached the project with
            determination and enthusiasm. One of the key aspects of the
            development was the utilization of relational databases,
            specifically MySQL, to efficiently store and retrieve the vast
            amount of data required for the account & user preference database.
            This involved thorough research and planning to architect the
            backend of the application and ensure seamless interactions between
            the frontend and backend systems. It is an area that I really
            attempted to fully understand and master, and I am proud of the
            result.
          </p>
          <div className="space8" />
          <h2>Closing</h2>
          <div className="space8" />
          <p>
            Thank you for visiting my website. I hope you found value in
            exploring PlatePlanner. If you have any feedback, whether it's
            something you enjoyed or suggestions for improvement, please feel
            free to reach out through the feedback button at the bottom of the
            page. My aim is to inspire you with new meal ideas, ignite your
            passion for web development, or simply provide a moment of
            entertainment. Your support means a lot to me.
          </p>
          <p>
            Best regards,
            <br />
            Jasdeep
          </p>
        </div>
      </div>
      <div style={{ height: "100px" }} />
      <Footer />
    </>
  );
}

export default About;

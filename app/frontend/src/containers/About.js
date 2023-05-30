import React, { lazy, Suspense } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';

const ImageModal = lazy(() => import('../components/ImageModal'));

function About(props) {

    return (
        <>
            <Header {...props} />
            <div className='about'>
                <div className='aboutBody'>
                    <h2>
                        About
                    </h2>
                    <div className='space8' />
                    <p>
                        Hey! My name is Jasdeep, and I built PlatePlanner.
                    </p>
                    <p>
                        I'm currently a rising junior at the University of Maryland studying computer science.
                    </p>
                    <div className='space8' />
                    <h2>
                        Inspiration
                    </h2>
                    <div className='space8' />
                    <p>
                        The idea of creating a website started at the end of 2022.  Web development is one of the areas of
                        computer science that UMD doesn't focus on, so naturally I was very curious about the subject.
                        I figured the best way to learn about it was to jump right in.  But first, I needed an idea.  I wanted to make a site
                        that would not only solve a problem, but be interesting to me.  One of my biggiest hobbies is lifting, so naturally
                        I thought of different ideas based around that. The problem I wanted to solve hit me; all I eat is
                        chicken and rice. Like multiple meals of it every day, and trust me, I was sick of it.  Surely, there must be a better
                        way to hit my "macro" goals in less of a soul-crushing meal than chicken and rice...
                    </p>
                    <p>
                        That problem spawned the idea of Plate Planner.  I wanted to create a meal plan generator that, given calorie and
                        macronutrient information, would spit back out randomly generated meal plans (think of it like a reverse MyFittnessPal).  I had to
                        source this food data from somewhere.  I starting by using the <a href='https://fdc.nal.usda.gov/'>USDA food database</a> which
                        houses the hundreds the of thousands of foods that are on every nutrition label. The biggest difficulty I had with this database
                        was figuring out how to match foods together.  How would I know that chicken breast goes well with potatoes, and not, say, grape jelly? This is what
                        led me to using the <a href='https://spoonacular.com/food-api'>Spoonacular API</a>, which was a database full of <b>recipes</b>.
                        I dive into the detail on how I generate these foods in my <Link to='/howitworks'>How it works</Link> page.
                    </p>
                    <div className='space8' />
                    <h2>
                        Development
                    </h2>
                    <div className='space8' />
                    <p>
                        Once I had my idea down, as well as the technologies I was going to use, I hit the ground running.  In fact, when I first started
                        building this site, I didn't know any HTML, CSS, or even Javascript!  But hey, the best way to learn it to jump right in.  And I learned a lot.
                        Over the course of a few months, I became obsessed with this project.  I would work on it whenever I got the chance, and it
                        would constantly be in the back of my mind.  I loved it, and completely fell in love with web developement (as well as design/UI).
                        The end product turned out better than I ever could have imagined.
                        <br />
                    </p>
                    <div className='space8' />
                    <h2>
                        Original Designs
                    </h2>
                    <div className='space16' />
                    <div className='aboutImgBody'>
                        <Suspense fallback={<div>Loading...</div>}>
                            <ImageModal number={1} />
                            <ImageModal number={2} />
                        </Suspense>
                    </div>
                    <div className='space32' />
                    <h2>
                        Closing
                    </h2>
                    <div className='space8' />
                    <p>
                        Thanks for checking out my site.  If there's something you particularly enjoyed, or noticed an aspect I could
                        have improved, hit the feedback button at the bottom of the page.  Whether this site gives you some meal ideas, inspires
                        you to build a website, or even entertained you for a minute, I'm glad you stopped by.
                    </p>
                    <p>
                        Best,
                        <br />
                        Jasdeep
                    </p>
                </div>
            </div>
            <div style={{ height: '100px' }} />
            <Footer />
        </>
    )
}


export default About;

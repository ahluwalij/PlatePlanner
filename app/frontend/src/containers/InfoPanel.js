import React from 'react';

import calendar from '../InfoPanelSVGs/calendar.svg';
import save from '../InfoPanelSVGs/save.svg';
import wrench from '../InfoPanelSVGs/wrench.svg';

// for icons:
// dark green: #338A58
// light green: #51B37E

// ideal square is 45px x 45px with a 16px margin-bottom
function InfoPanel(props) {
    return (
        <>
            <div className='infoPanel'>
                <div className='infoSquare'>
                    <img className='infoSquareIcon' src={calendar} alt="calendar" draggable='false'
                        style={{ width: 48, height: 48, marginBottom: '13px' }} />
                    <h3 className='infoSquareTitle'>Remove your anxiety</h3>
                    <p className='infoSquareText'>
                        Plate Plan will generate all your meals ahead of time.
                        That way, you don’t have to worry about what you’re doing to eat for the next meal.
                </p>
                </div>
                <div className='infoSquare'>
                    <img className='infoSquareIcon' src={wrench} alt="calendar" draggable='false'
                        style={{ width: 42, height: 42, marginBottom: '19px' }} />
                    <h3 className='infoSquareTitle'>Customize to your needs</h3>
                    <p className='infoSquareText'>
                        You can customize your preferences to fit your needs.
                        Whether you liking snacking throughout the day,
                        or need to hit your daily protein requirement, Plate Plan has you covered.
                </p>
                </div>
                <div className='infoSquare'>
                    <img className='infoSquareIcon' src={save} alt="calendar" draggable='false'
                        style={{ width: 41, height: 41, marginBottom: '20px' }} />
                    <h3 className='infoSquareTitle'>Save your favorite meals</h3>
                    <p className='infoSquareText'>
                        See a meal that peaks your interest?  Use your Plate Plan account to save it for later,
                        or pin it in place to keep it in your future meal plans.
                </p>
                </div>
            </div>
            <div className='infoPanelSpacer' />
        </>
    )
}

export default InfoPanel;
